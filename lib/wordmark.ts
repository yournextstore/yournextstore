// Advance widths (em) of Climate Crisis, the original's wordmark face. The store name is set in it
// and sized to a target width, the way the original sizes its logo artwork.
const ADVANCE: Record<string, number> = {
	A: 1.047,
	B: 1.046,
	C: 1.122,
	D: 1.067,
	E: 0.885,
	F: 0.877,
	G: 1.129,
	H: 1.01,
	I: 0.455,
	J: 0.613,
	K: 1.049,
	L: 0.84,
	M: 1.245,
	N: 1.016,
	O: 1.12,
	P: 1.03,
	Q: 1.113,
	R: 1.03,
	S: 1.078,
	T: 0.927,
	U: 1.02,
	V: 1.028,
	W: 1.384,
	X: 1.02,
	Y: 1.089,
	Z: 0.902,
	"0": 1.12,
	"1": 0.556,
	"2": 1.02,
	"3": 1.092,
	"4": 1.02,
	"5": 1.02,
	"6": 1.094,
	"7": 0.909,
	"8": 1.059,
	"9": 1.094,
	" ": 0.2,
	"&": 0.963,
	"-": 0.41,
	".": 0.405,
	"'": 0.375,
	Ł: 0.895,
};

/** Total advance of `text` in em, uppercased (unknown glyphs count as a wide letter). */
export function wordmarkAdvance(text: string): number {
	const letters = [...text.toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g, "")];
	return Math.max(
		1,
		letters.reduce((sum, letter) => sum + (ADVANCE[letter] ?? 1.05), 0),
	);
}
