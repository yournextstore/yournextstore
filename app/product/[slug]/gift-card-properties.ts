import type { APICartCreateBody } from "commerce-kit";

export const GIFT_MESSAGE_MAX = 200;
export const GIFT_NAME_MAX = 255;
export const GIFT_SEND_WINDOW_DAYS = 90;

const pad = (value: number) => String(value).padStart(2, "0");

/** A local calendar day as the `YYYY-MM-DD` a date input reads and writes. */
export const localDateString = (date: Date) =>
	`${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/** `Date#getTimezoneOffset()` minutes (positive west of UTC) as an ISO 8601 offset, e.g. -60 → "+01:00". */
export const formatUtcOffset = (timezoneOffsetMinutes: number) => {
	const east = -timezoneOffsetMinutes;
	const minutes = Math.abs(east);
	return `${east < 0 ? "-" : "+"}${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
};

/** Local midnight of the chosen day with the buyer's own offset that day, e.g. "2026-12-24T00:00:00+01:00". */
export const sendOnValue = (day: string) => {
	const [year = 0, month = 1, date = 1] = day.split("-").map(Number);
	return `${day}T00:00:00${formatUtcOffset(new Date(year, month - 1, date).getTimezoneOffset())}`;
};

const field = (formData: FormData, name: string) => {
	const value = formData.get(name);
	return typeof value === "string" ? value.trim() : "";
};

/**
 * The gift card's cart line properties from the add-to-cart form. The recipient fields only render
 * while "Send as a gift" is ticked, so without them the card goes to the buyer and nothing is sent.
 */
export function giftCardProperties(formData: FormData): APICartCreateBody["properties"] {
	if (!formData.has("recipient_email")) return undefined;
	const sendOn = field(formData, "send_on");
	const entries = [
		{ key: "recipient_email", label: "Recipient email", value: field(formData, "recipient_email") },
		{ key: "recipient_name", label: "Recipient name", value: field(formData, "recipient_name") },
		{ key: "message", label: "Message", value: field(formData, "message") },
		{ key: "send_on", label: "Send on", value: sendOn ? sendOnValue(sendOn) : "" },
	];
	return entries.filter(({ value }) => value !== "").map((entry) => ({ ...entry, type: "text" as const }));
}
