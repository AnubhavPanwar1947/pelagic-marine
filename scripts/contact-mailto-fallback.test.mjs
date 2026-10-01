import assert from "node:assert/strict";
import { buildEnquiryMailtoUrl } from "../src/lib/contact-mailto-fallback.ts";

const url = buildEnquiryMailtoUrl({
  firstName: "Ana",
  lastName: "O'Brien & Co",
  email: "visitor+test@example.com",
  service: "General enquiry",
  subject: "Mooring study",
  message: "Line 1\nLine 2 & more",
  preferredOffice: "Dubai",
  urgency: "Standard — within business days",
});

assert.ok(url.startsWith("mailto:info@pelagic-marine.com?"));
assert.ok(!url.includes("+"), "mailto query must not use + encoding for spaces");

const query = url.slice(url.indexOf("?") + 1);
const subjectMatch = query.match(/^subject=([^&]*)/);
const bodyMatch = query.match(/&body=(.*)$/);
assert.ok(subjectMatch, "subject param present");
assert.ok(bodyMatch, "body param present");

const subject = decodeURIComponent(subjectMatch[1]);
const body = decodeURIComponent(bodyMatch[1]);

assert.equal(subject, "Website enquiry — Mooring study");
assert.ok(body.includes("Hello Pelagic Marine Consultants,"));
assert.ok(body.includes("Ana O'Brien & Co"));
assert.ok(body.includes("visitor+test@example.com"));
assert.ok(body.includes("Line 1\nLine 2 & more"));
assert.ok(body.includes("Office: Dubai"));
assert.ok(!body.includes("Subject:"));
assert.ok(body.includes("Kind regards,"));

console.log("contact-mailto-fallback.test.mjs: passed");
