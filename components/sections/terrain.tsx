import { SectionHead } from "@/components/field/section-head";
import type { FieldPick } from "@/components/field/terrain-switcher";
import { TerrainSwitcher } from "@/components/field/terrain-switcher";
import { formatFromPrice, GRID_REFS, getFieldCatalog } from "@/lib/field";

export async function Terrain() {
	const { products } = await getFieldCatalog();
	// One pick per forecast: the first product whose name or category suits the weather, otherwise
	// a spread across the catalogue, never naming the same product twice.
	const used = new Set<string>();
	const pick = async (match: RegExp, fallbackIndex: number): Promise<FieldPick | null> => {
		const fits = (p: (typeof products)[number]) =>
			!used.has(p.id) && match.test(`${p.name} ${p.category?.name ?? ""}`);
		const third = Math.max(1, Math.floor(products.length / 3));
		const spread = products[(fallbackIndex * third) % Math.max(1, products.length)];
		const product =
			products.find(fits) ??
			(spread && !used.has(spread.id) ? spread : products.find((p) => !used.has(p.id)));
		if (!product) return null;
		used.add(product.id);
		return { name: product.name, slug: product.slug, price: await formatFromPrice(product.variants) };
	};
	const alpine = await pick(/expedition|down|thermal|four/i, 0);
	const desert = await pick(/quilt|daypack|headlamp|stove/i, 1);
	const coastal = await pick(/tunnel|dry|bivy|pack/i, 2);

	return (
		<section id="terrain" className="cut-both section-x section-y scroll-mt-16">
			<SectionHead
				gridRef={GRID_REFS[1]}
				eyebrow="READ THE FORECAST"
				title={
					<>
						One kit list,
						<br />
						whatever the forecast says.
					</>
				}
				lead="Pick the weather and the sky over the ridge changes with it, and so does what goes in the pack first."
				className="mb-[2.4rem]"
			/>
			<TerrainSwitcher picks={{ alpine, desert, coastal }} />
		</section>
	);
}
