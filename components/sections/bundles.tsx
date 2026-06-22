import Image from "next/image";
import { YnsLink } from "../yns-link";

type Bundle = {
	tag: string;
	name: string;
	description: string;
	price: string;
	image: string;
};

const BUNDLES: Bundle[] = [
	{
		tag: "Kit 01",
		name: "Farmer's Market Bundle",
		description: "The cart, the insulated tote, and the produce roll. Saturday-morning ready.",
		price: "$248",
		image: "/scraped-1.jpg",
	},
	{
		tag: "Kit 02",
		name: "Laundry Day Bundle",
		description: "Folding cart, mesh hamper, and the linen sack. For the four-flight walk-up.",
		price: "$196",
		image: "/scraped-2.jpg",
	},
	{
		tag: "Kit 03",
		name: "Picnic Bundle",
		description: "Mini cart, woven blanket, and the field kit. Park-side, no fuss.",
		price: "$172",
		image: "/scraped-3.jpg",
	},
	{
		tag: "Kit 04",
		name: "Studio Bundle",
		description: "The everyday cart, canvas tool roll, and a folding stool. Hands free.",
		price: "$224",
		image: "/scraped-4.jpg",
	},
];

export function Bundles() {
	return (
		<section id="bundles" className="bg-clay/60 border-y border-ink/10">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="flex items-end justify-between gap-6 mb-10 sm:mb-12">
					<div>
						<span className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-ink/60">
							<span className="block h-px w-8 bg-brick" />
							No. 02 — Bundles
						</span>
						<h2 className="font-display-wide text-[clamp(2rem,5vw,4rem)] leading-[0.95] uppercase mt-4 text-balance">
							Pre-rolled kits.
						</h2>
					</div>
					<p className="hidden md:block max-w-sm text-sm text-ink/70">
						Curated by the team for the way you actually use them. Save up to 18%.
					</p>
				</div>

				<div className="-mx-4 sm:-mx-6 lg:-mx-8">
					<div className="flex gap-5 overflow-x-auto hide-scrollbar px-4 sm:px-6 lg:px-8 snap-x snap-mandatory">
						{BUNDLES.map((bundle) => (
							<YnsLink
								key={bundle.name}
								href="/products"
								className="group relative snap-start shrink-0 w-[78vw] sm:w-[44vw] lg:w-[28vw] xl:w-[22vw] bg-background border border-ink/10 overflow-hidden"
							>
								<div className="relative aspect-[4/5] bg-clay">
									<Image
										src={bundle.image}
										alt={bundle.name}
										fill
										sizes="(max-width: 640px) 78vw, (max-width: 1024px) 44vw, 28vw"
										className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
									/>
									<div className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-ink/85 text-bone px-2.5 py-1 text-[9px] tracking-[0.3em] uppercase">
										{bundle.tag}
									</div>
									<div className="absolute bottom-3 right-3 bg-bone text-ink px-3 py-1.5 text-[11px] font-semibold tabular-nums">
										{bundle.price}
									</div>
								</div>
								<div className="p-5">
									<h3 className="font-display-wide text-[15px] tracking-[0.04em] uppercase">{bundle.name}</h3>
									<p className="mt-2 text-sm text-ink/70 leading-relaxed">{bundle.description}</p>
									<div className="mt-4 flex items-center gap-2 text-[11px] tracking-[0.28em] uppercase font-medium">
										Shop the kit
										<span
											aria-hidden
											className="inline-block w-5 h-px bg-ink transition-all group-hover:w-10"
										/>
									</div>
								</div>
							</YnsLink>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
