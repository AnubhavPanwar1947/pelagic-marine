<?php
/**
 * Pelagic Marine Solutions — DreamHost contact form handler
 * - No third-party APIs (no Supabase / Resend / Vercel)
 * - Uses DreamHost PHP mail()
 * - Notifies Pelagic + auto-replies to the visitor
 *
 * REQUIRED on DreamHost:
 * 1) Create mailbox: info@pelagic-marine.com (Mail → Manage Email)
 * 2) Upload this file to the Pelagic web root with your static site
 */

declare(strict_types=1);

header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');

const ADMIN_EMAIL = 'info@pelagic-marine.com';
const FROM_EMAIL = 'info@pelagic-marine.com';
const FROM_NAME = 'Pelagic Marine Solutions';
const SITE_NAME = 'Pelagic Marine Solutions';
const SITE_URL = 'https://pelagic-marine.com';
const MAX_PER_HOUR = 8;

function wants_json(): bool
{
    $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
    $xhr = $_SERVER['HTTP_X_REQUESTED_WITH'] ?? '';
    return stripos($accept, 'application/json') !== false
        || strcasecmp($xhr, 'XMLHttpRequest') === 0;
}

function respond(bool $ok, string $message, int $status = 200, ?array $extra = null): void
{
    http_response_code($status);
    if (wants_json()) {
        header('Content-Type: application/json; charset=utf-8');
        $payload = [
            'ok' => $ok,
            'success' => $ok,
            'error' => $ok ? null : $message,
            'message' => $message,
        ];
        if (is_array($extra)) {
            $payload = array_merge($payload, $extra);
        }
        echo json_encode($payload);
        exit;
    }

    $target = $ok ? '/contact/?sent=1' : '/contact/?error=1';
    header('Location: ' . $target, true, 303);
    exit;
}

function clean_header(string $value): string
{
    return trim(str_replace(["\r", "\n", "%0a", "%0d"], '', $value));
}

function clean_text(string $value, int $max = 4000): string
{
    $value = str_replace(["\r\n", "\r"], "\n", $value);
    $value = trim(strip_tags($value));
    if (strlen($value) > $max) {
        $value = substr($value, 0, $max);
    }
    return $value;
}

function client_ip(): string
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    return preg_replace('/[^a-zA-Z0-9\.:_-]/', '', $ip) ?: 'unknown';
}

function rate_limited(string $ip): bool
{
    $dir = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'pelagic-contact-rate';
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }
    $file = $dir . DIRECTORY_SEPARATOR . hash('sha256', $ip) . '.json';
    $now = time();
    $window = 3600;
    $hits = [];

    if (is_file($file)) {
        $raw = @file_get_contents($file);
        $decoded = json_decode((string) $raw, true);
        if (is_array($decoded)) {
            $hits = array_values(array_filter($decoded, static fn($t) => is_int($t) && ($now - $t) < $window));
        }
    }

    if (count($hits) >= MAX_PER_HOUR) {
        return true;
    }

    $hits[] = $now;
    @file_put_contents($file, json_encode($hits), LOCK_EX);
    return false;
}

function make_reference(): string
{
    return 'PMC-' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 8));
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(false, 'Invalid request method.', 405);
}

// Honeypot — bots fill this; humans never see it
$honeypot = trim((string) ($_POST['company_website'] ?? $_POST['website'] ?? ''));
if ($honeypot !== '') {
    respond(true, 'Thank you — your enquiry has been received.', 200, [
        'data' => [
            'reference' => 'PMC-ACCEPTED',
            'confirmationEmailSent' => false,
        ],
    ]);
}

// Minimum fill time (~3s) — blocks instant bot posts
$started = (int) ($_POST['form_started_at'] ?? 0);
if ($started > 0 && (time() * 1000 - $started) < 3000) {
    respond(false, 'Please take a moment and try again.', 429);
}

$ip = client_ip();
if (rate_limited($ip)) {
    respond(false, 'Too many enquiries from this network. Please try again later, or call our 24/7 line.', 429);
}

$name = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$company = trim((string) ($_POST['company'] ?? ''));
$phone = trim((string) ($_POST['phone'] ?? ''));
$vessel = trim((string) ($_POST['vessel'] ?? ''));
$imo = trim((string) ($_POST['imo'] ?? ''));
$port = trim((string) ($_POST['port'] ?? ''));
$service = trim((string) ($_POST['service'] ?? ''));
$urgency = trim((string) ($_POST['urgency'] ?? ''));
$subject = trim((string) ($_POST['subject'] ?? ''));
$preferredOffice = trim((string) ($_POST['preferredOffice'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));

if ($name === '' || $email === '' || $message === '' || $service === '') {
    respond(false, 'Please complete all required fields.', 400);
}

if (
    strlen($name) > 120
    || strlen($email) > 180
    || strlen($company) > 180
    || strlen($phone) > 60
    || strlen($vessel) > 200
    || strlen($imo) > 40
    || strlen($port) > 200
    || strlen($service) > 180
    || strlen($urgency) > 80
    || strlen($subject) > 180
    || strlen($preferredOffice) > 120
    || strlen($message) > 4000
) {
    respond(false, 'One or more fields are too long.', 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Please enter a valid email address.', 400);
}

$name_h = clean_header($name);
$email_h = clean_header($email);
$company_h = clean_header($company);
$phone_h = clean_header($phone);
$vessel_h = clean_header($vessel);
$imo_h = clean_header($imo);
$port_h = clean_header($port);
$service_h = clean_header($service);
$urgency_h = clean_header($urgency);
$subject_h = clean_header($subject !== '' ? $subject : $service);
$office_h = clean_header($preferredOffice);
$safe_message = clean_text($message, 4000);

if ($name_h === '' || $email_h === '' || $safe_message === '') {
    respond(false, 'Invalid input.', 400);
}

$reference = make_reference();
$vessel_line = $vessel_h;
if ($imo_h !== '') {
    $vessel_line = $vessel_line !== '' ? ($vessel_line . ' · IMO ' . $imo_h) : ('IMO ' . $imo_h);
}

$admin_subject = 'Pelagic website enquiry: ' . $subject_h . ' [' . $reference . ']';
$admin_body =
    "New enquiry from the Pelagic Marine website\n\n" .
    "Reference: {$reference}\n" .
    "Name: {$name_h}\n" .
    "Email: {$email_h}\n" .
    "Company: " . ($company_h !== '' ? $company_h : '—') . "\n" .
    "Phone: " . ($phone_h !== '' ? $phone_h : '—') . "\n" .
    "Subject: {$subject_h}\n" .
    "Service: {$service_h}\n" .
    "Preferred office: " . ($office_h !== '' ? $office_h : '—') . "\n" .
    "Vessel / project: " . ($vessel_line !== '' ? $vessel_line : '—') . "\n" .
    "Port / location: " . ($port_h !== '' ? $port_h : '—') . "\n" .
    "Urgency: " . ($urgency_h !== '' ? $urgency_h : '—') . "\n" .
    "IP: {$ip}\n" .
    "Time: " . gmdate('Y-m-d H:i:s') . " UTC\n\n" .
    "Message:\n{$safe_message}\n";

$admin_headers = [
    'From: ' . FROM_NAME . ' <' . FROM_EMAIL . '>',
    'Reply-To: ' . $name_h . ' <' . $email_h . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PelagicContactForm',
];

$admin_ok = @mail(
    ADMIN_EMAIL,
    '=?UTF-8?B?' . base64_encode($admin_subject) . '?=',
    $admin_body,
    implode("\r\n", $admin_headers)
);

$visitor_subject = 'We received your enquiry — ' . SITE_NAME . ' [' . $reference . ']';
$visitor_body =
    "Dear {$name_h},\n\n" .
    "Thank you for contacting " . SITE_NAME . ".\n\n" .
    "We have received your enquiry and will get back to you as soon as possible.\n\n" .
    "Reference: {$reference}\n" .
    "Subject: {$subject_h}\n" .
    "Service: {$service_h}\n" .
    ($vessel_line !== '' ? "Vessel / project: {$vessel_line}\n" : '') .
    ($port_h !== '' ? "Port / location: {$port_h}\n" : '') .
    "\n----- Your message -----\n" .
    "{$safe_message}\n" .
    "------------------------\n\n" .
    "For time-critical casualties, please call our India or UAE line rather than waiting on email.\n\n" .
    "Warm regards,\n" .
    SITE_NAME . "\n" .
    FROM_EMAIL . "\n" .
    SITE_URL . "\n";

$visitor_headers = [
    'From: ' . FROM_NAME . ' <' . FROM_EMAIL . '>',
    'Reply-To: ' . FROM_EMAIL,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PelagicContactForm',
];

$visitor_ok = @mail(
    $email_h,
    '=?UTF-8?B?' . base64_encode($visitor_subject) . '?=',
    $visitor_body,
    implode("\r\n", $visitor_headers)
);

if (!$admin_ok) {
    respond(
        false,
        'We could not send your message right now. Please email ' . ADMIN_EMAIL . ' directly.',
        500
    );
}

respond(
    true,
    $visitor_ok
        ? 'Thank you — your enquiry has been sent. A confirmation email is on its way.'
        : 'Thank you — your enquiry has been sent. Our team will get back to you soon.',
    200,
    [
        'data' => [
            'reference' => $reference,
            'confirmationEmailSent' => $visitor_ok,
            'confirmationEmailError' => $visitor_ok
                ? null
                : 'Confirmation email could not be delivered. Please save your reference.',
        ],
    ]
);
