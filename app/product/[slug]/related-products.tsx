import { cacheLife } from "next/cache";
import { PieceCard } from "@/components/maison/piece-card";
import { toPieces } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";

// Cached per category, not per product: every record in a department shares one browse,
// and the current piece is filtered out afterwards.
async function getDepartmentPieces(categorySlug?: string) {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce
		.productBrowse({ active: true, limit: 5, ...(categorySlug ? { category: categorySlug } : {}) })
		.catch(() => ({ data: [] }));
	return toPieces(data);
}

/** "Also in …": rendered inside the page's own boundary (a nested one shifted the footer). */
export async function RelatedProducts({
	productId,
	categorySlug,
	categoryName,
}: {
	productId: string;
	categorySlug?: string;
	categoryName?: string;
}) {
	const pieces = (await getDepartmentPieces(categorySlug))
		.filter((piece) => piece.id !== productId)
		.slice(0, 4);
	if (pieces.length === 0) return null;

	return (
		<section className="border-t border-line pb-10 pt-10">
			<h2 className="eti mb-6 tracking-[0.16em] text-dim">
				{categoryName ? `Also in ${categoryName.toLocaleLowerCase()}` : "Also in the archive"}
			</h2>
			<div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-x-[30px] gap-y-10">
				{pieces.map((piece) => (
					<PieceCard key={piece.id} piece={piece} headingLevel={3} />
				))}
			</div>
		</section>
	);
}
