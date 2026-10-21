/**
 * Advance widths (in em) of Archivo at width 62%, weight 900, uppercase. Used to size a
 * display word so it fills its line without overflowing (ported from the original theme).
 */
const ADVANCE: Record<string, number> = {
	A: 0.52,
	B: 0.49,
	C: 0.5,
	D: 0.5,
	E: 0.45,
	F: 0.39,
	G: 0.53,
	H: 0.5,
	I: 0.25,
	J: 0.44,
	K: 0.5,
	L: 0.42,
	M: 0.7,
	N: 0.51,
	O: 0.54,
	P: 0.48,
	Q: 0.54,
	R: 0.5,
	S: 0.46,
	T: 0.47,
	U: 0.49,
	V: 0.48,
	W: 0.72,
	X: 0.49,
	Y: 0.47,
	Z: 0.47,
	"0": 0.43,
	"1": 0.36,
	"2": 0.42,
	"3": 0.43,
	"4": 0.43,
	"5": 0.43,
	"6": 0.44,
	"7": 0.39,
	"8": 0.42,
	"9": 0.44,
	"-": 0.23,
	"%": 0.73,
	" ": 0.1,
	".": 0.21,
	"&": 0.56,
	"'": 0.2,
};

const advance = (text: string) =>
	text
		.toUpperCase()
		.split("")
		.reduce((total, char) => total + (ADVANCE[char] ?? ADVANCE[char.normalize("NFD")[0] ?? ""] ?? 0.5), 0);

/** Width of `text` in em, with a 3% margin for kerning and rounding. */
function displayEm(text: string) {
	return Math.max(advance(text), 1) * 1.03;
}

/**
 * `min(<px>, <vw>)` that fits `text` on one line: at most `maxPx`, never wider than
 * `budgetPx`, and scaling as `vwBudget` vw below that.
 */
export function fitDisplaySize(
	text: string,
	{ maxPx, budgetPx, vwBudget }: { maxPx: number; budgetPx: number; vwBudget: number },
) {
	const em = displayEm(text);
	const px = Math.min(maxPx, Math.floor(budgetPx / em));
	return `min(${px}px, ${(vwBudget / em).toFixed(2)}vw)`;
}

/** How many lines `text` takes in display type in a column `measureEm` wide. */
export function displayLines(text: string, measureEm: number) {
	return text
		.trim()
		.split(/\s+/)
		.flatMap((word) => word.split(/(?<=-)/))
		.reduce(
			(acc, chunk) => {
				const width = advance(chunk) * 1.03;
				const gap = acc.used > 0 ? (ADVANCE[" "] ?? 0.1) : 0;
				return acc.used > 0 && acc.used + gap + width > measureEm
					? { lines: acc.lines + 1, used: width }
					: { lines: acc.lines, used: acc.used + gap + width };
			},
			{ lines: 1, used: 0 },
		).lines;
}

/**
 * The largest of `steps` (largest first) at which `text` takes at most `maxLines` lines in a
 * column `columnPx` wide: a short product name is giant, a long one steps down.
 */
export function fitDisplayStep(text: string, steps: readonly number[], columnPx: number, maxLines = 2) {
	return steps.find((px) => displayLines(text, columnPx / px) <= maxLines) ?? steps[steps.length - 1] ?? 44;
}

/** One `min(px, vw)` for a set of display words: sized so the longest fills its line. */
export function fitDisplaySizeAll(
	texts: readonly string[],
	options: { maxPx: number; budgetPx: number; vwBudget: number },
) {
	const longest = texts.reduce(
		(best, text) => (displayEm(text) > displayEm(best) ? text : best),
		texts[0] ?? "",
	);
	return fitDisplaySize(longest, options);
}
