/**
 * The original gives every collection and product page its own colour theme (a pastel ground
 * and a deep ink of the same hue). The store has no such field, so each one is picked from this
 * set by its slug: stable across visits, varied across the catalogue. Every ink clears WCAG AA
 * on its ground, and white clears it on every ink (buttons and masked artwork).
 */
export type ColorTheme = { background: string; text: string; shape: string };

export const COLOR_THEMES = [
	{ background: "#e1dcff", text: "#3f4fd1", shape: "shape-arch" },
	{ background: "#cfe6e1", text: "#1f6b55", shape: "shape-flower" },
	{ background: "#ffefd6", text: "#a3541b", shape: "shape-circle" },
	{ background: "#ffe3ee", text: "#b8336a", shape: "shape-pill" },
	{ background: "#d6ecf5", text: "#1f5f87", shape: "shape-arch" },
] as const satisfies readonly ColorTheme[];

export const PEACH_THEME: ColorTheme = { background: "#ffe1d1", text: "#2b2e2e", shape: "shape-flower" };

export function colorThemeFor(key: string): ColorTheme {
	const hash = [...key].reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 7);
	return COLOR_THEMES[hash % COLOR_THEMES.length] ?? PEACH_THEME;
}

export function colorThemeAt(index: number): ColorTheme {
	return COLOR_THEMES[index % COLOR_THEMES.length] ?? PEACH_THEME;
}
