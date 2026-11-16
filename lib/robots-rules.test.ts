import { expect, test } from "bun:test";
import { storeRobotsGroups } from "@/lib/robots-rules";

test("a crawler's rules become one group", () => {
	expect(storeRobotsGroups({ robotsRules: "User-agent: GPTBot\nDisallow: /" })).toEqual([
		{ userAgent: ["GPTBot"], disallow: ["/"] },
	]);
});

test("groups, shared user agents, allow lines and a crawl delay are kept as written", () => {
	const text = [
		"user-agent: GPTBot",
		"User-Agent: CCBot",
		"Disallow: /",
		"",
		"User-agent: *",
		"Disallow: /outlet/",
		"Allow: /outlet/new",
		"Crawl-delay: 5",
	].join("\r\n");
	expect(storeRobotsGroups({ robotsRules: text })).toEqual([
		{ userAgent: ["GPTBot", "CCBot"], disallow: ["/"] },
		{ userAgent: ["*"], allow: ["/outlet/new"], disallow: ["/outlet/"], crawlDelay: 5 },
	]);
});

test("rules written before any User-agent line apply to every crawler", () => {
	expect(storeRobotsGroups({ robotsRules: "Disallow: /private\nDisallow: /drafts" })).toEqual([
		{ userAgent: ["*"], disallow: ["/private", "/drafts"] },
	]);
});

test("comments, other directives and broken lines are dropped", () => {
	const text = [
		"# keep AI crawlers out",
		"Sitemap: https://evil.example/sitemap.xml",
		"Host: evil.example",
		"User-agent: GPTBot # OpenAI",
		"Disallow: /   # everything",
		"Disallow:",
		"Crawl-delay: soon",
		"nonsense",
	].join("\n");
	expect(storeRobotsGroups({ robotsRules: text })).toEqual([{ userAgent: ["GPTBot"], disallow: ["/"] }]);
});

test("a user agent with no rule of its own prints nothing", () => {
	expect(storeRobotsGroups({ robotsRules: "User-agent: GPTBot" })).toEqual([]);
});

test("no rules, or settings of another shape, give no groups", () => {
	expect(storeRobotsGroups({ robotsRules: null })).toEqual([]);
	expect(storeRobotsGroups({ robotsRules: "   " })).toEqual([]);
	expect(storeRobotsGroups({ robotsRules: 42 })).toEqual([]);
	expect(storeRobotsGroups({})).toEqual([]);
	expect(storeRobotsGroups(null)).toEqual([]);
	expect(storeRobotsGroups(undefined)).toEqual([]);
});
