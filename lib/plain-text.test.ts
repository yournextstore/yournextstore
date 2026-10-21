import { expect, test } from "bun:test";
import { plainText } from "@/lib/plain-text";

test("plainText flattens TipTap JSON and passes strings through", () => {
	expect(plainText("Hello")).toBe("Hello");
	expect(
		plainText({
			type: "doc",
			content: [
				{ type: "paragraph", content: [{ type: "text", text: "Warm light" }] },
				{ type: "paragraph", content: [{ type: "text", text: "for long evenings." }] },
			],
		}),
	).toBe("Warm light for long evenings.");
	expect(plainText(null)).toBe("");
});
