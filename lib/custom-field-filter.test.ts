import { expect, test } from "bun:test";
import { encodeCustomFieldFilter, parseCustomFieldFilter } from "@/lib/custom-field-filter";

test("encodeCustomFieldFilter produces the API's filter format", () => {
	expect(
		encodeCustomFieldFilter({ "product.custom.material": ["wool", "silk"], "variant.custom.fit": ["slim"] }),
	).toBe("product.custom.material:wool,silk;variant.custom.fit:slim");
});

test("encodeCustomFieldFilter skips fields with no options", () => {
	expect(encodeCustomFieldFilter({ "product.custom.material": [], "variant.custom.fit": ["slim"] })).toBe(
		"variant.custom.fit:slim",
	);
	expect(encodeCustomFieldFilter({})).toBe("");
});

test("parseCustomFieldFilter round-trips what encodeCustomFieldFilter produces", () => {
	const record = { "product.custom.material": ["wool", "silk"], "variant.custom.weight": ["100..300"] };
	expect(parseCustomFieldFilter(encodeCustomFieldFilter(record))).toEqual(record);
});

test("parseCustomFieldFilter drops malformed segments instead of throwing", () => {
	expect(parseCustomFieldFilter(null)).toEqual({});
	expect(parseCustomFieldFilter("")).toEqual({});
	expect(parseCustomFieldFilter("product.custom.material")).toEqual({});
	expect(parseCustomFieldFilter(":wool;product.custom.material:;variant.custom.fit:slim")).toEqual({
		"variant.custom.fit": ["slim"],
	});
});
