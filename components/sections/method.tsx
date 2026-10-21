import { cacheLife } from "next/cache";
import { BrewMethod, type ShelfTab } from "@/components/brew/brew-method";
import { SectionHead } from "@/components/brew/section-head";
import { formatFromPrice, getCatalog } from "@/lib/brew";
import { commerce } from "@/lib/commerce";
import { shelfPhoto } from "@/lib/editorial";

const isPriced = (v: { price: string }) => Number(v.price) > 0;

/** The original's brew-method tabs, one per top-level category: a readout of the shelf and its first pieces. */
async function getShelves(): Promise<ShelfTab[]> {
	"use cache";
	cacheLife("minutes");
	const [{ products }, categories] = await Promise.all([
		getCatalog(),
		commerce.categoriesBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] })),
	]);
	const shelves = await Promise.all(
		categories.data
			.filter((category) => !category.parentId)
			.map(async (category, i) => {
				const members = products
					.filter((p) => p.category?.id === category.id)
					// Photographed, priced pieces first, so the readout leads with something to look at.
					.sort(
						(a, b) =>
							Number(a.images.length === 0) - Number(b.images.length === 0) ||
							Number(!a.variants.some(isPriced)) - Number(!b.variants.some(isPriced)),
					);
				if (members.length === 0) return null;
				const variants = members.flatMap((p) => p.variants).filter(isPriced);
				const range = variants.length > 0 ? await formatFromPrice(variants) : null;
				const [from, to] = range?.split(" – ") ?? [];
				const inStock = members.filter((p) => p.variants.some((v) => v.stock !== 0)).length;
				const lines = await Promise.all(
					members.slice(0, 3).map(async (p) => ({
						name: p.name,
						href: `/product/${p.slug}`,
						price: p.variants.some(isPriced) ? await formatFromPrice(p.variants.filter(isPriced)) : null,
					})),
				);
				const spec: [string, string][] = [
					["Pieces", String(members.length)],
					...(from ? ([["From", from]] as [string, string][]) : []),
					...(to ? ([["Up to", to]] as [string, string][]) : []),
					["In stock", String(inStock)],
					["Options", String(members.reduce((sum, p) => sum + p.variants.length, 0))],
				];
				return {
					key: category.slug,
					label: category.name,
					code: `SHELF ${String(i + 1).padStart(2, "0")}`,
					href: `/category/${category.slug}`,
					image: shelfPhoto(`${category.name} ${category.slug}`),
					spec,
					lines,
				} satisfies ShelfTab;
			}),
	);
	return shelves.filter((shelf): shelf is ShelfTab => shelf !== null).slice(0, 3);
}

export async function Method() {
	const shelves = await getShelves();
	if (shelves.length < 2) return null;

	return (
		<section id="method" className="section-x section-y scroll-mt-16">
			<SectionHead
				eyebrow="Choose your shelf"
				title={
					<>
						One counter, <em>{shelves.length === 2 ? "two shelves." : "three shelves."}</em>
					</>
				}
				lead="Machines, grinders, tools and cups each keep their own readout: how many models, where the prices sit, what is in stock. Pick one and the numbers roll into place."
			/>
			<BrewMethod shelves={shelves} />
		</section>
	);
}
