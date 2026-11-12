import { describe, expect, test } from "bun:test";
import { formatUtcOffset, giftCardProperties, sendOnValue } from "@/app/product/[slug]/gift-card-properties";

const form = (fields: Record<string, string>) =>
	Object.entries(fields).reduce((data, [name, value]) => {
		data.append(name, value);
		return data;
	}, new FormData());

describe("giftCardProperties", () => {
	test("sends nothing when the gift fields are not shown", () => {
		expect(giftCardProperties(form({}))).toBeUndefined();
	});

	test("trims values and leaves out empty optional fields", () => {
		expect(
			giftCardProperties(
				form({ recipient_email: "  ana@example.com ", recipient_name: "   ", message: "", send_on: "" }),
			),
		).toEqual([{ key: "recipient_email", label: "Recipient email", type: "text", value: "ana@example.com" }]);
	});

	test("sends every filled field with its label", () => {
		const properties = giftCardProperties(
			form({
				recipient_email: "ana@example.com",
				recipient_name: "Ana",
				message: " Happy birthday! ",
				send_on: "2026-12-24",
			}),
		);
		expect(properties?.map(({ key, value }) => [key, value])).toEqual([
			["recipient_email", "ana@example.com"],
			["recipient_name", "Ana"],
			["message", "Happy birthday!"],
			["send_on", sendOnValue("2026-12-24")],
		]);
	});
});

describe("send on", () => {
	test("formats the browser offset as ±HH:MM", () => {
		expect(formatUtcOffset(-60)).toBe("+01:00");
		expect(formatUtcOffset(0)).toBe("+00:00");
		expect(formatUtcOffset(300)).toBe("-05:00");
		expect(formatUtcOffset(-330)).toBe("+05:30");
		expect(formatUtcOffset(570)).toBe("-09:30");
	});

	test("is local midnight of the chosen day with the offset on that day", () => {
		const offset = formatUtcOffset(new Date(2026, 11, 24).getTimezoneOffset());
		expect(sendOnValue("2026-12-24")).toBe(`2026-12-24T00:00:00${offset}`);
		expect(new Date(sendOnValue("2026-12-24")).getTime()).toBe(new Date(2026, 11, 24).getTime());
	});
});
