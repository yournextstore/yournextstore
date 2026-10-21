import { describe, expect, test } from "bun:test";
import { hasPicture, picturedFirst } from "./pictured";

describe("picturedFirst", () => {
	test("moves products without any image to the end, keeping order", () => {
		const list = [
			{ id: "a", images: [] },
			{ id: "b", images: ["x"] },
			{ id: "c", images: [], variants: [{ images: ["y"] }] },
			{ id: "d", images: [] },
		];
		expect(picturedFirst(list).map((p) => p.id)).toEqual(["b", "c", "a", "d"]);
	});

	test("variant images count as a picture", () => {
		expect(hasPicture({ images: [], variants: [{ images: [] }, { images: ["z"] }] })).toBe(true);
		expect(hasPicture({ images: [] })).toBe(false);
	});
});
