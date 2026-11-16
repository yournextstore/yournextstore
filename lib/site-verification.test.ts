import { expect, test } from "bun:test";
import { siteVerificationMetadata } from "@/lib/site-verification";

test("both codes become Next's verification metadata", () => {
	expect(siteVerificationMetadata({ siteVerification: { google: "g-code", bing: "ABC123" } })).toEqual({
		google: "g-code",
		other: { "msvalidate.01": "ABC123" },
	});
});

test("a single code leaves the other tag out", () => {
	expect(siteVerificationMetadata({ siteVerification: { google: " g-code " } })).toEqual({
		google: "g-code",
	});
	expect(siteVerificationMetadata({ siteVerification: { google: null, bing: "ABC123" } })).toEqual({
		other: { "msvalidate.01": "ABC123" },
	});
});

test("no code means no verification metadata at all", () => {
	expect(siteVerificationMetadata(null)).toBeUndefined();
	expect(siteVerificationMetadata({})).toBeUndefined();
	expect(siteVerificationMetadata({ siteVerification: null })).toBeUndefined();
	expect(siteVerificationMetadata({ siteVerification: { google: "", bing: "  " } })).toBeUndefined();
	expect(siteVerificationMetadata({ siteVerification: { google: 12345 } })).toBeUndefined();
});
