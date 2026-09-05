import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { contrastRatio, parseCssBlock, resolveColor, SUPPORTED_SYNTAXES } from "@/lib/contrast";

/**
 * The palette in `app/globals.css` must clear WCAG AA (4.5:1) for body text on
 * every surface it is painted on. Themes fork this file, so the check lives
 * here rather than in a reviewer's eye: darken the *text* token, never lighten
 * the tint the design is built on.
 */

const AA = 4.5;
const FIX = "darken `--muted-foreground` until ≥ 4.5; keep the tint";

/** Text token, surface token — every combination the components actually paint. */
const PAIRS = [
	["foreground", "background"],
	["card-foreground", "card"],
	["popover-foreground", "popover"],
	["muted-foreground", "background"],
	["muted-foreground", "card"],
	["muted-foreground", "muted"],
	["muted-foreground", "secondary"],
	["secondary-foreground", "secondary"],
	["accent-foreground", "accent"],
	["primary-foreground", "primary"],
] as const;

const css = readFileSync(join(import.meta.dir, "globals.css"), "utf8");

const blocks = [":root", ".dark"] as const;

blocks.map((selector) => {
	const tokens = parseCssBlock(css, selector);

	test(`${selector} declares a palette`, () => {
		expect(tokens).not.toBeNull();
	});

	return PAIRS.map(([fg, bg]) => {
		const declared = tokens?.[fg] !== undefined && tokens?.[bg] !== undefined;
		// A theme that drops a token simply has no such pair to check.
		const check = declared ? test : test.skip;

		return check(`${selector}: --${fg} on --${bg} clears WCAG AA`, () => {
			const palette = tokens ?? {};
			const text = resolveColor(fg, palette);
			const surface = resolveColor(bg, palette);

			// An unreadable value is a failure, not a skip: `color-mix()` in a theme
			// would otherwise hide a contrast regression from this test.
			expect(
				text,
				`${selector} --${fg}: ${palette[fg]} — unsupported colour syntax. Supported: ${SUPPORTED_SYNTAXES}.`,
			).not.toBeNull();
			expect(
				surface,
				`${selector} --${bg}: ${palette[bg]} — unsupported colour syntax. Supported: ${SUPPORTED_SYNTAXES}.`,
			).not.toBeNull();
			if (!text || !surface) return;

			const ratio = contrastRatio(text, surface);
			expect(
				ratio,
				`${selector} --${fg} on --${bg} is ${ratio.toFixed(2)}:1, below WCAG AA (${AA}:1) — ${FIX}`,
			).toBeGreaterThanOrEqual(AA);
		});
	});
});
