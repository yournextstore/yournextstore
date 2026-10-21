// Pure display helpers for the ledger look (no SDK import: client components use these too).

/** Store initials for lot numbers: "Your Next Store" → "YNS" (one-word names keep two letters). */
export function storeInitials(name: string): string {
	const words = name
		.normalize("NFKD")
		.replace(/[^\p{L}\p{N}\s]/gu, " ")
		.split(/\s+/)
		.filter(Boolean);
	if (words.length === 0) return "YN";
	if (words.length === 1) return (words[0] ?? "YN").slice(0, 2).toUpperCase();
	return words
		.slice(0, 3)
		.map((word) => word[0])
		.join("")
		.toUpperCase();
}

/** A stable three-digit entry number from the product id, so the lot reads the same on every page. */
function entryNumber(id: string): string {
	let hash = 0;
	for (const char of id) {
		hash = (hash * 31 + char.charCodeAt(0)) % 997;
	}
	return String(hash + 1).padStart(3, "0");
}

/** "Lot Nº HSL-26-014": the SKU when the product has one, else initials · year · entry. */
export function lotNumber({
	store,
	id,
	createdAt,
	sku,
}: {
	store: string;
	id: string;
	createdAt?: string | null;
	sku?: string | null;
}): string {
	if (sku) return sku.toUpperCase();
	const yy = entryYear(createdAt)?.slice(-2) ?? "00";
	return `${storeInitials(store)}-${yy}-${entryNumber(id)}`;
}

/** The year a product was entered, for the gold "2026 · Lighting" line. */
export function entryYear(createdAt?: string | null): string | null {
	// The API sends "2026-04-01 12:20:56.56+00", which Date() cannot parse; the year is the first four digits.
	return createdAt?.match(/^(\d{4})-/)?.[1] ?? null;
}

export type LedgerStatus = { tone: "open" | "cellar" | "allocated" | "out"; label: string };

const FEW_LEFT = 5;

/** The original's status pill, read from stock: available, few left (gold), on sale, sold out. */
export function ledgerStatus({
	stock,
	onSale,
}: {
	/** Sum of tracked stock; null when any variant is untracked. */
	stock: number | null;
	onSale?: boolean;
}): LedgerStatus {
	if (stock === 0) return { tone: "out", label: "Sold out" };
	if (stock !== null && stock <= FEW_LEFT) return { tone: "cellar", label: `Few left — ${stock} in stock` };
	if (onSale) return { tone: "cellar", label: "Ledger price — on sale" };
	return { tone: "open", label: "Available now" };
}

const NUMBER_WORDS = [
	"Zero",
	"One",
	"Two",
	"Three",
	"Four",
	"Five",
	"Six",
	"Seven",
	"Eight",
	"Nine",
	"Ten",
	"Eleven",
	"Twelve",
];

/** "Four" for small counts, digits above twelve. */
export const numberWord = (n: number) => NUMBER_WORDS[n] ?? String(n);

/** Splits a store name into the hero's two display lines: at an ampersand, else at the middle word. */
export function wordmarkLines(name: string): { first: string; second: string; ampersand: boolean } {
	const trimmed = name.trim();
	const amp = trimmed.split(/\s*&\s*/);
	if (amp.length === 2 && amp[0] && amp[1]) {
		return { first: amp[0], second: amp[1], ampersand: true };
	}
	const words = trimmed.split(/\s+/);
	if (words.length < 2) return { first: trimmed, second: "", ampersand: false };
	const cut = Math.ceil(words.length / 2);
	return { first: words.slice(0, cut).join(" "), second: words.slice(cut).join(" "), ampersand: false };
}
