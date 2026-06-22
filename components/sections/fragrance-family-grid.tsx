import Image from "next/image";
import { previewHref } from "@/lib/demo-products";
import { YnsLink } from "../yns-link";

const TILES = [
	{
		label: "Smoke & Cedar",
		notes: "vetiver · cade · cedar",
		image: "/scraped-2.jpg",
		href: "/products",
		size: "lg",
	},
	{
		label: "Linen & Light",
		notes: "orris · iris · musk",
		image: "/scraped-1.jpg",
		href: "/products",
		size: "sm",
	},
	{
		label: "Citrus & Salt",
		notes: "bergamot · neroli · sea air",
		image: "/scraped-3.jpg",
		href: "/products",
		size: "sm",
	},
	{
		label: "Honey & Tonka",
		notes: "tonka · honey · amber",
		image: "/scraped-0.jpg",
		href: "/products",
		size: "lg",
	},
] as const;

export function FragranceFamilyGrid({ preview = false }: { preview?: boolean }) {
	return (
		<section className="bg-[#f4efe6]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="text-center mb-14">
					<p className="text-[11px] tracking-luxe uppercase text-[#8b6b4a] mb-3">Fragrance Families</p>
					<h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground">Find your accord</h2>
					<div className="mt-5 mx-auto h-px w-12 bg-[#c9a87c]" />
				</div>
				<div className="grid grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-6">
					{TILES.map((tile, i) => {
						const span =
							tile.size === "lg"
								? i === 0
									? "lg:col-span-7 aspect-[4/5] lg:aspect-[5/4]"
									: "lg:col-span-7 lg:col-start-6 aspect-[4/5] lg:aspect-[5/4]"
								: "lg:col-span-5 aspect-[4/5]";
						return (
							<YnsLink
								prefetch="eager"
								key={tile.label}
								href={previewHref(tile.href, preview)}
								className={`group relative overflow-hidden bg-[#e8dcc8] ${span}`}
							>
								<Image
									src={tile.image}
									alt={tile.label}
									fill
									sizes="(max-width: 1024px) 50vw, 40vw"
									className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-[#1a1410]/55 via-[#1a1410]/10 to-transparent" />
								<div className="absolute inset-0 flex flex-col items-center justify-end pb-8 text-center text-[#f4efe6]">
									<h3 className="font-serif text-2xl sm:text-3xl mb-2">{tile.label}</h3>
									<p className="text-[10px] tracking-luxe uppercase text-[#e8dcc8]/85">{tile.notes}</p>
								</div>
							</YnsLink>
						);
					})}
				</div>
			</div>
		</section>
	);
}
