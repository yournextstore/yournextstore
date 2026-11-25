import { expect, mock, test } from "bun:test";

process.env.YNS_API_KEY ??= "test-key";
const bot = { isBot: false };
mock.module("botid/server", () => ({ checkBotId: async () => bot }));
const commerceModule = await import("@/lib/commerce");
const contactMessageCreate = mock(async () => ({}));
mock.module("@/lib/commerce", () => ({
	...commerceModule,
	commerce: { ...commerceModule.commerce, contactMessageCreate },
}));
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

test("sendContactMessage thanks a bot and drops its message", async () => {
	bot.isBot = true;
	contactMessageCreate.mockClear();
	const result = await sendContactMessage(null, form({ email: "a@b.co", message: "Hi" }));
	bot.isBot = false;
	expect(result).toEqual({ success: true, message: "Thanks for reaching out! We'll get back to you soon." });
	expect(contactMessageCreate).not.toHaveBeenCalled();
});

test("sendContactMessage sends a person's message", async () => {
	contactMessageCreate.mockClear();
	const result = await sendContactMessage(null, form({ email: "a@b.co", message: "Hi" }));
	expect(result?.success).toBe(true);
	expect(contactMessageCreate).toHaveBeenCalledWith({ email: "a@b.co", message: "Hi" });
});

test("subscribeToNewsletter rejects a missing email", async () => {
	const result = await subscribeToNewsletter(null, form({}));
	expect(result).toEqual({ success: false, message: "", error: "Please enter a valid email address." });
});
