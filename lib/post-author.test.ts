import { expect, test } from "bun:test";
import { postAuthorLine, postAuthorOf } from "@/lib/post-author";

test("a post with an author names them, with what the store says about them", () => {
	const post = {
		title: "Five ways to scent a small room",
		author: {
			name: " Anna Berg ",
			jobTitle: "Perfumer",
			bio: "Blends candles since 2012.",
			image: "https://x/a.jpg",
		},
	};
	expect(postAuthorOf(post)).toEqual({
		name: "Anna Berg",
		jobTitle: "Perfumer",
		bio: "Blends candles since 2012.",
	});
});

test("only the name is required", () => {
	expect(postAuthorOf({ author: { name: "Anna Berg", jobTitle: "", bio: null } })).toEqual({
		name: "Anna Berg",
	});
});

test("a post by the store has no author", () => {
	expect(postAuthorOf({ author: null })).toBeNull();
	expect(postAuthorOf({ title: "No author field" })).toBeNull();
	expect(postAuthorOf({ author: { name: "  " } })).toBeNull();
	expect(postAuthorOf({ author: "Anna Berg" })).toBeNull();
	expect(postAuthorOf(null)).toBeNull();
});

test("the byline joins the name and the job title", () => {
	expect(postAuthorLine({ name: "Anna Berg", jobTitle: "Perfumer" })).toBe("Anna Berg, Perfumer");
	expect(postAuthorLine({ name: "Anna Berg" })).toBe("Anna Berg");
});
