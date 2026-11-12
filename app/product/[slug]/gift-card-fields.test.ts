import { afterEach, describe, expect, test } from "bun:test";
import { giftCardProperties } from "@/app/product/[slug]/gift-card-fields";

const form = (fields: Record<string, string>) =>
	Object.entries(fields).reduce((data, [name, value]) => {
		data.append(name, value);
		return data;
	}, new FormData());

const sendOn = (day: string) =>
	giftCardProperties(form({ recipient_email: "ana@example.com", send_on: day }))?.find(
		({ key }) => key === "send_on",
	)?.value;

const zone = process.env.TZ;
afterEach(() => {
	process.env.TZ = zone;
});

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
		process.env.TZ = "Europe/Warsaw";
		expect(
			giftCardProperties(
				form({
					recipient_email: "ana@example.com",
					recipient_name: "Ana",
					message: " Happy birthday! ",
					send_on: "2026-12-24",
				}),
			),
		).toEqual([
			{ key: "recipient_email", label: "Recipient email", type: "text", value: "ana@example.com" },
			{ key: "recipient_name", label: "Recipient name", type: "text", value: "Ana" },
			{ key: "message", label: "Message", type: "text", value: "Happy birthday!" },
			{ key: "send_on", label: "Send on", type: "text", value: "2026-12-24T00:00:00+01:00" },
		]);
	});

	test("sends the chosen day as local midnight with the buyer's offset on that day", () => {
		process.env.TZ = "Europe/Warsaw";
		expect(sendOn("2026-07-01")).toBe("2026-07-01T00:00:00+02:00");
		process.env.TZ = "UTC";
		expect(sendOn("2026-12-24")).toBe("2026-12-24T00:00:00+00:00");
		process.env.TZ = "America/New_York";
		expect(sendOn("2026-12-24")).toBe("2026-12-24T00:00:00-05:00");
		process.env.TZ = "Asia/Kolkata";
		expect(sendOn("2026-12-24")).toBe("2026-12-24T00:00:00+05:30");
		process.env.TZ = "Pacific/Marquesas";
		expect(sendOn("2026-12-24")).toBe("2026-12-24T00:00:00-09:30");
	});
});
