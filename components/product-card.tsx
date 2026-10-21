import { PieceCard } from "@/components/maison/piece-card";
import { type CatalogSource, toPieces } from "@/lib/catalog";

/** Server entry for one archive card (search results, blog embeds, related pieces). */
export async function ProductCard({
	product,
	priority = false,
	headingLevel = 2,
}: {
	product: CatalogSource;
	priority?: boolean;
	headingLevel?: 2 | 3;
}) {
	const [piece] = await toPieces([product]);
	return piece ? <PieceCard piece={piece} priority={priority} headingLevel={headingLevel} /> : null;
}
