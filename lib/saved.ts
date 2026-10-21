import type { Piece } from "@/lib/catalog";

/** A saved piece: enough to list it in the vault without another request. */
export type SavedPiece = {
	slug: string;
	href: string;
	name: string;
	no: string;
	image: string | null;
	priceLabel: string;
};

// A plain module on purpose: server pages call this too, and an export of a "use client"
// file reaches the server as a client reference, not a function.
export function savedOf(piece: Piece): SavedPiece {
	return {
		slug: piece.slug,
		href: piece.href,
		name: piece.name,
		no: piece.no,
		image: piece.image,
		priceLabel: piece.priceLabel,
	};
}
