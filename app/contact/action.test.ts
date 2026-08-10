import { expect, test } from "bun:test";

process.env.YNS_API_KEY ??= "test-key";
const { sendContactMessage } = await import("@/app/contact/action");
const { subscribeToNewsletter } = await import("@/app/newsletter/action");

const form = (entries: Record<string, string>) => {
	const fd = new FormData();
	for (const [key, value] of Object.entries(entries)) {
		fd.set(key, value);
	}
	return fd;
};

test("sendContactMessage rejects a missing email", async () => {
	const result = await sendContactMessage(null, form({ message: "Hi" }));
	expect(result).toEqual({ success: false, message: "", error: "Please enter a valid email address." });
});

test("sendContactMessage rejects an empty message", async () => {
	const result = await sendContactMessage(null, form({ email: "a@b.co", message: "   " }));
	expect(result).toEqual({ success: false, message: "", error: "Please enter a message." });
});

test("subscribeToNewsletter rejects a missing email", async () => {
	const result = await subscribeToNewsletter(null, form({}));
	expect(result).toEqual({ success: false, message: "", error: "Please enter a valid email address." });
});
