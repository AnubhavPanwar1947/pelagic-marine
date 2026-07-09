import type { Office } from "@/lib/site-data";

const OFFICE_TIMEZONE: Record<Office["region"], string> = {
  India: "Asia/Kolkata",
  UAE: "Asia/Dubai",
};

const OFFICE_TZ_LABEL: Record<Office["region"], string> = {
  India: "IST",
  UAE: "GST",
};

export function getOfficeLocalTime(office: Office, now = new Date()) {
  const time = now.toLocaleTimeString("en-GB", {
    timeZone: OFFICE_TIMEZONE[office.region],
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${time} ${OFFICE_TZ_LABEL[office.region]}`;
}
