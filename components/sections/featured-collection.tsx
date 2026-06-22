import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "@/components/yns-link";
import { previewHref } from "@/lib/demo-products";

type FeaturedCollectionProps = {
	isPreview?: boolean;
};

const STORIES = [
	{
		eyebrow: "Stoneware",
		title: "From wheel to table",
		caption: "Eight new vessels — fired to keep mornings unhurried.",
		image: "/scraped-3.jpg",
		href: "/collection/kitchen",
		price: "From $62",
	},
	{
		eyebrow: "Lounge",
		title: "Soft as afternoon light",
		caption: "Boucle and shearling in caramel and oat tones.",
		image: "/scraped-1.jpg",
		href: "/collection/living",
		price: "From $1,460",
	},
	{
		eyebrow: "Light",
		title: "An alabaster glow",
		caption: "Hand-cut pendants that pour honey into the room.",
		image: "/scraped-4.jpg",
		href: "/collection/lighting",
		price: "From $324",
	},
];

export function FeaturedCollection({ isPreview = false }: FeaturedCollectionProps) {
	return (
		<section className="bg-cream py-16 sm:py-24">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-end justify-between mb-12">
					<div className="max-w-md">
						<p className="text-[11px] uppercase tracking-[0.32em] text-clay/80 mb-3">Atelier favorites</p>
						<h2 className="font-serif text-3xl sm:text-5xl text-walnut tracking-tight text-balance">
							Three quiet objects
							<br />
							<span className="italic text-clay">for the home</span>
						</h2>
					</div>
					<YnsLink
						href={previewHref("/products", isPreview)}
						className="hidden sm:inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-espresso/70 hover:text-espresso"
					>
						View all
						<ArrowRightIcon className="h-3.5 w-3.5" />
					</YnsLink>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
					{STORIES.map((story, idx) => (
						<YnsLink
							key={story.title}
							href={previewHref(story.href, isPreview)}
							prefetch={"eager"}
							className="group block"
						>
							<div className="relative aspect-[3/4] overflow-hidden rounded-md bg-sand">
								<Image
									src={story.image}
									alt={story.title}
									fill
									sizes="(max-width: 768px) 100vw, 33vw"
									className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
								/>
								<div
									aria-hidden="true"
									className="absolute inset-0 bg-gradient-to-t from-walnut/40 via-transparent to-transparent"
								/>
								<div className="absolute top-5 left-5 right-5 flex items-center justify-between text-cream/95">
									<span className="text-[10px] uppercase tracking-[0.28em] bg-walnut/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
										{story.eyebrow}
									</span>
									<span className="text-[10px] uppercase tracking-[0.22em] font-serif">0{idx + 1}</span>
								</div>
							</div>
							<div className="mt-5 flex items-start justify-between gap-4">
								<div>
									<h3 className="font-serif text-xl sm:text-2xl text-walnut leading-tight">{story.title}</h3>
									<p className="mt-1.5 text-sm text-espresso/65 leading-relaxed">{story.caption}</p>
								</div>
								<span className="shrink-0 text-[11px] uppercase tracking-[0.18em] text-clay">
									{story.price}
								</span>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
