import Link from "next/link";
import { getCategoryTiles } from "@/lib/catalog";
import { YNSMedia } from "@/lib/yns-media";

/**
 * "Our products": the store's categories as large two-up photographs with a caption. Three
 * categories sit three-up from md (the first full width on phones); a lone one spans the row.
 */
export async function CategoryShowcase() {
	const tiles = await getCategoryTiles(4);
	if (tiles.length === 0) return null;
	const span = (index: number) => {
		if (tiles.length === 1) return "col-span-full";
		if (tiles.length === 3) return index === 0 ? "col-span-full md:col-span-4" : "col-span-6 md:col-span-4";
		return "col-span-6";
	};
	const offset = (index: number) => {
		if (tiles.length === 3) return index > 0 ? "max-md:mt-8" : "";
		return index > 1 ? "mt-8 md:mt-16" : "";
	};

	return (
		<section className="layout max-md:gap-x-2">
			<h2 className="col-span-full mb-8 text-title-md md:mb-15 md:text-title-2xl">Our products</h2>
			{tiles.map((tile, index) => (
				<Link key={tile.id} href={tile.href} className={`group ${span(index)} ${offset(index)}`}>
					<div className="relative mb-2 aspect-[4/3] overflow-hidden bg-grayscale-50 md:mb-8">
						{tile.image && (
							<YNSMedia
								src={tile.image}
								alt=""
								fill
								sizes={tiles.length === 3 ? "(max-width: 768px) 100vw, 33vw" : "50vw"}
								className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
							/>
						)}
					</div>
					<p className="text-body-xs md:text-title-md">{tile.name}</p>
				</Link>
			))}
		</section>
	);
}
