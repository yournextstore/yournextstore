/**
 * WCAG contrast maths over the design tokens in `app/globals.css`.
 *
 * Small on purpose: enough CSS colour syntax to read our own palette (`#hex`,
 * `rgb()`, `hsl()`, `oklch()` and `var()` chains) and nothing more. Anything it
 * cannot parse returns `null` so a caller can fail loudly instead of quietly
 * skipping a token it does not understand.
 */

export type Rgb = { r: number; g: number; b: number; a: number };

/** The colour syntaxes `resolveColor` understands — quoted in test failures. */
export const SUPPORTED_SYNTAXES =
	"#rgb, #rrggbb, #rrggbbaa, rgb()/rgba(), hsl()/hsla(), oklch(L C H [/ a]), var(--token)";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/**
 * Custom properties of the first `selector { … }` block in `css`.
 *
 * Brace-matched rather than regex-sliced: `@theme inline { … }` and nested
 * at-rules sit between the blocks we care about, and a lazy `{[^}]*}` stops at
 * the first inner brace.
 */
export const parseCssBlock = (css: string, selector: string) => {
	// Match the selector only where it opens a rule: `.dark` also appears inside
	// `@custom-variant dark (&:is(.dark *))`, which is not a block.
	const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const header = css.match(new RegExp(`(?:^|[};])\\s*${escaped}\\s*\\{`, "m"));
	if (header?.index === undefined) return null;

	const rest = css.slice(header.index + header[0].length - 1);
	const scan = rest.split("").reduce(
		(state, char, index) => {
			if (state.end !== -1) return state;
			if (char === "{") return { depth: state.depth + 1, end: -1 };
			if (char === "}") {
				const depth = state.depth - 1;
				return { depth, end: depth === 0 ? index : -1 };
			}
			return state;
		},
		{ depth: 0, end: -1 },
	);
	if (scan.end === -1) return null;

	// Comments and nested blocks (`@media { … }`) are dropped so only the block's
	// own declarations are read.
	const declarations = rest
		.slice(1, scan.end)
		.replace(/\/\*[\s\S]*?\*\//g, "")
		.split("")
		.reduce(
			(state, char) => {
				if (char === "{") return { depth: state.depth + 1, text: state.text };
				if (char === "}") return { depth: Math.max(0, state.depth - 1), text: state.text };
				return state.depth === 0 ? { depth: 0, text: state.text + char } : state;
			},
			{ depth: 0, text: "" },
		).text;

	return Object.fromEntries(
		Array.from(declarations.matchAll(/--([\w-]+)\s*:\s*([^;]+)/g)).flatMap(([, name, value]) =>
			name && value ? [[name, value.trim()] as const] : [],
		),
	);
};

const parseHex = (value: string) => {
	const hex = value.slice(1);
	const expand = (pair: string) => Number.parseInt(pair, 16) / 255;
	if (hex.length === 3 || hex.length === 4) {
		const channels = hex.split("").map((char) => expand(char + char));
		const [r, g, b, a] = channels;
		if (r === undefined || g === undefined || b === undefined) return null;
		return { r, g, b, a: a ?? 1 };
	}
	if (hex.length === 6 || hex.length === 8) {
		const channels = (hex.match(/../g) ?? []).map(expand);
		const [r, g, b, a] = channels;
		if (r === undefined || g === undefined || b === undefined) return null;
		return { r, g, b, a: a ?? 1 };
	}
	return null;
};

/** `12`, `50%` or `none` → a number; `%` is divided by `scale`. */
const parseComponent = (raw: string, scale: number) => {
	if (raw === "none") return 0;
	const percent = raw.endsWith("%");
	const value = Number.parseFloat(percent ? raw.slice(0, -1) : raw);
	if (Number.isNaN(value)) return null;
	return percent ? (value / 100) * scale : value;
};

/** Alpha as `0–1`, accepting `0.5` or `50%`. */
const parseAlpha = (raw: string | undefined) => {
	if (raw === undefined) return 1;
	const value = parseComponent(raw, 1);
	return value === null ? null : clamp01(value);
};

/** `rgb(1 2 3 / 50%)`, `rgb(1, 2, 3)`, `hsl(0 0% 100%)` … → its arguments. */
const parseFunction = (value: string, name: string) => {
	const match = value.match(new RegExp(`^${name}a?\\(([^)]*)\\)$`, "i"));
	if (!match?.[1]) return null;
	const [main, alpha] = match[1].split("/");
	if (main === undefined) return null;
	const args = main
		.trim()
		.split(/[\s,]+/)
		.filter(Boolean);
	return { args, alpha: alpha?.trim() };
};

const parseRgb = (value: string) => {
	const parsed = parseFunction(value, "rgb");
	if (!parsed) return null;
	const [rawR, rawG, rawB, inlineAlpha] = parsed.args;
	if (rawR === undefined || rawG === undefined || rawB === undefined) return null;
	const r = parseComponent(rawR, 255);
	const g = parseComponent(rawG, 255);
	const b = parseComponent(rawB, 255);
	const a = parseAlpha(parsed.alpha ?? inlineAlpha);
	if (r === null || g === null || b === null || a === null) return null;
	return { r: clamp01(r / 255), g: clamp01(g / 255), b: clamp01(b / 255), a };
};

const hueToRgb = (p: number, q: number, tRaw: number) => {
	const t = (tRaw + 1) % 1;
	if (t < 1 / 6) return p + (q - p) * 6 * t;
	if (t < 1 / 2) return q;
	if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
	return p;
};

const parseHsl = (value: string) => {
	const parsed = parseFunction(value, "hsl");
	if (!parsed) return null;
	const [rawH, rawS, rawL, inlineAlpha] = parsed.args;
	if (rawH === undefined || rawS === undefined || rawL === undefined) return null;
	const h = parseComponent(rawH.replace(/deg$/i, ""), 360);
	const s = parseComponent(rawS, 100);
	const l = parseComponent(rawL, 100);
	const a = parseAlpha(parsed.alpha ?? inlineAlpha);
	if (h === null || s === null || l === null || a === null) return null;

	const sat = clamp01(s / 100);
	const light = clamp01(l / 100);
	const q = light < 0.5 ? light * (1 + sat) : light + sat - light * sat;
	const p = 2 * light - q;
	const hue = (((h % 360) + 360) % 360) / 360;
	return {
		r: hueToRgb(p, q, hue + 1 / 3),
		g: hueToRgb(p, q, hue),
		b: hueToRgb(p, q, hue - 1 / 3),
		a,
	};
};

const gamma = (channel: number) =>
	channel <= 0.0031308 ? channel * 12.92 : 1.055 * channel ** (1 / 2.4) - 0.055;

/** OKLab → sRGB, Björn Ottosson's matrices; out-of-gamut results are clamped. */
const oklabToRgb = (L: number, aLab: number, bLab: number) => {
	const l = (L + 0.3963377774 * aLab + 0.2158037573 * bLab) ** 3;
	const m = (L - 0.1055613458 * aLab - 0.0638541728 * bLab) ** 3;
	const s = (L - 0.0894841775 * aLab - 1.291485548 * bLab) ** 3;
	return {
		r: clamp01(gamma(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s)),
		g: clamp01(gamma(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s)),
		b: clamp01(gamma(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s)),
	};
};

const parseOklch = (value: string) => {
	const parsed = parseFunction(value, "oklch");
	if (!parsed) return null;
	const [rawL, rawC, rawH, inlineAlpha] = parsed.args;
	if (rawL === undefined || rawC === undefined || rawH === undefined) return null;
	// Lightness is 0–1 or a percentage of it; chroma is absolute; hue is degrees.
	const L = parseComponent(rawL, 1);
	const c = parseComponent(rawC, 0.4);
	const h = parseComponent(rawH.replace(/deg$/i, ""), 360);
	const a = parseAlpha(parsed.alpha ?? inlineAlpha);
	if (L === null || c === null || h === null || a === null) return null;

	const radians = (h * Math.PI) / 180;
	const { r, g, b } = oklabToRgb(clamp01(L), c * Math.cos(radians), c * Math.sin(radians));
	return { r, g, b, a };
};

const parseValue = (value: string): Rgb | null => {
	const trimmed = value.trim();
	if (trimmed.startsWith("#")) return parseHex(trimmed);
	if (/^rgba?\(/i.test(trimmed)) return parseRgb(trimmed);
	if (/^hsla?\(/i.test(trimmed)) return parseHsl(trimmed);
	if (/^oklch\(/i.test(trimmed)) return parseOklch(trimmed);
	// color-mix(), light-dark(), colour keywords, … — deliberately unsupported.
	return null;
};

const MAX_VAR_HOPS = 10;

/**
 * Resolve a token to sRGB, following `var(--x)` chains (and their fallbacks).
 * `null` means "not a colour this module can read" — never "transparent".
 */
export const resolveColor = (name: string, tokens: Record<string, string>): Rgb | null => {
	const seed = tokens[name];
	if (seed === undefined) return null;

	const value = Array.from({ length: MAX_VAR_HOPS }).reduce<string | null>((current) => {
		if (current === null) return null;
		const match = current.trim().match(/^var\(\s*--([^,)]+?)\s*(?:,([\s\S]*))?\)$/);
		if (!match?.[1]) return current;
		return tokens[match[1].trim()] ?? match[2]?.trim() ?? null;
	}, seed);

	return value === null ? null : parseValue(value);
};

/** Flatten a translucent foreground over an opaque background. */
export const composite = (fg: Rgb, bg: Rgb): Rgb => ({
	r: fg.r * fg.a + bg.r * (1 - fg.a),
	g: fg.g * fg.a + bg.g * (1 - fg.a),
	b: fg.b * fg.a + bg.b * (1 - fg.a),
	a: 1,
});

const linearize = (channel: number) =>
	channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;

/** WCAG 2.x relative luminance. */
export const relativeLuminance = ({ r, g, b }: Rgb) =>
	0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);

/** WCAG contrast ratio, 1–21. Translucent colours are composited over the other one. */
export const contrastRatio = (a: Rgb, b: Rgb) => {
	const flatB = b.a < 1 ? composite(b, { r: 1, g: 1, b: 1, a: 1 }) : b;
	const flatA = a.a < 1 ? composite(a, flatB) : a;
	const [lumA, lumB] = [relativeLuminance(flatA), relativeLuminance(flatB)];
	return (Math.max(lumA, lumB) + 0.05) / (Math.min(lumA, lumB) + 0.05);
};
