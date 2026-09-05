import { expect, test } from "bun:test";
import { composite, contrastRatio, parseCssBlock, type Rgb, resolveColor } from "@/lib/contrast";

const WHITE = { r: 1, g: 1, b: 1, a: 1 };
const BLACK = { r: 0, g: 0, b: 0, a: 1 };

const channels = (rgb: Rgb | null) => {
	if (!rgb) throw new Error("expected a colour, got null");
	return [rgb.r, rgb.g, rgb.b].map((channel) => Math.round(channel * 255));
};

const color = (value: string) => {
	const parsed = resolveColor("x", { x: value });
	if (!parsed) throw new Error(`expected ${value} to parse`);
	return parsed;
};

test("oklch resolves the achromatic ends of the scale", () => {
	expect(channels(color("oklch(1 0 0)"))).toEqual([255, 255, 255]);
	expect(channels(color("oklch(0 0 0)"))).toEqual([0, 0, 0]);
});

test("oklch matches the browser's sRGB conversion for a neutral grey", () => {
	// oklch(0.556 0 0) renders as #737373; allow one unit of rounding per channel.
	const [r, g, b] = channels(color("oklch(0.556 0 0)"));
	expect(Math.abs((r ?? 0) - 0x73)).toBeLessThanOrEqual(1);
	expect(Math.abs((g ?? 0) - 0x73)).toBeLessThanOrEqual(1);
	expect(Math.abs((b ?? 0) - 0x73)).toBeLessThanOrEqual(1);
});

test("oklch converts a chromatic colour through OKLab", () => {
	// oklch(0.627 0.258 29.23) is sRGB red.
	const [r, g, b] = channels(color("oklch(0.627 0.258 29.23)"));
	expect(Math.abs((r ?? 0) - 255)).toBeLessThanOrEqual(2);
	expect(g ?? 0).toBeLessThanOrEqual(2);
	expect(b ?? 0).toBeLessThanOrEqual(2);
});

test("oklch accepts a percentage lightness, a `none` hue and an alpha", () => {
	expect(channels(color("oklch(100% 0 none)"))).toEqual([255, 255, 255]);
	expect(color("oklch(1 0 0 / 10%)").a).toBeCloseTo(0.1, 5);
	expect(color("oklch(1 0 0 / 0.15)").a).toBeCloseTo(0.15, 5);
});

test("hex parses the 3-, 6- and 8-digit forms", () => {
	expect(channels(color("#fff"))).toEqual([255, 255, 255]);
	expect(channels(color("#737373"))).toEqual([115, 115, 115]);
	expect(color("#00000080").a).toBeCloseTo(0.502, 2);
});

test("rgb() and hsl() parse the legacy and the space-separated syntax", () => {
	expect(channels(color("rgb(115, 115, 115)"))).toEqual([115, 115, 115]);
	expect(channels(color("rgb(115 115 115 / 50%)"))).toEqual([115, 115, 115]);
	expect(color("rgba(0, 0, 0, 0.5)").a).toBeCloseTo(0.5, 5);
	expect(channels(color("hsl(0 0% 100%)"))).toEqual([255, 255, 255]);
	expect(channels(color("hsl(120, 100%, 50%)"))).toEqual([0, 255, 0]);
	expect(color("hsla(0, 0%, 0%, 0.25)").a).toBeCloseTo(0.25, 5);
});

test("resolveColor follows a var() chain", () => {
	const palette = { a: "var(--b)", b: "#fff" };
	expect(channels(resolveColor("a", palette))).toEqual([255, 255, 255]);
	expect(resolveColor("missing", palette)).toBeNull();
	// A dangling chain falls back to the var() fallback, then to nothing.
	expect(channels(resolveColor("c", { c: "var(--nope, #000)" }))).toEqual([0, 0, 0]);
	expect(resolveColor("d", { d: "var(--nope)" })).toBeNull();
});

test("unsupported syntax resolves to null rather than to a guess", () => {
	expect(resolveColor("x", { x: "color-mix(in oklch, black 50%, white)" })).toBeNull();
	expect(resolveColor("x", { x: "light-dark(#fff, #000)" })).toBeNull();
	expect(resolveColor("x", { x: "rebeccapurple" })).toBeNull();
});

test("composite flattens a translucent colour over its backdrop", () => {
	const flattened = composite({ ...BLACK, a: 0.5 }, WHITE);
	expect(channels(flattened)).toEqual([128, 128, 128]);
	expect(flattened.a).toBe(1);
});

test("contrastRatio matches the WCAG extremes", () => {
	expect(contrastRatio(WHITE, BLACK)).toBeCloseTo(21, 2);
	expect(contrastRatio(WHITE, WHITE)).toBeCloseTo(1, 5);
	// A translucent foreground is composited before the ratio is taken.
	expect(contrastRatio({ ...BLACK, a: 0.5 }, WHITE)).toBeCloseTo(contrastRatio(color("#808080"), WHITE), 1);
});

test("parseCssBlock brace-matches the block instead of stopping at the first `}`", () => {
	const css = [
		"@custom-variant dark (&:is(.dark *));",
		":root {",
		"\t--background: oklch(1 0 0);",
		"\t/* a comment; with a semicolon */",
		"\t--foreground: var(--background);",
		"\t@media (min-width: 40rem) { --radius: 1rem; }",
		"\t--muted: oklch(0.97 0 0);",
		"}",
		".dark { --background: oklch(0.145 0 0); }",
	].join("\n");

	const root = parseCssBlock(css, ":root");
	expect(root?.background).toBe("oklch(1 0 0)");
	expect(root?.muted).toBe("oklch(0.97 0 0)");
	expect(channels(resolveColor("foreground", root ?? {}))).toEqual([255, 255, 255]);

	// The `.dark` inside `@custom-variant` must not be mistaken for the block.
	expect(parseCssBlock(css, ".dark")?.background).toBe("oklch(0.145 0 0)");
	expect(parseCssBlock(css, ".missing")).toBeNull();
});
