import Image from "next/image";
import { YnsLink } from "../yns-link";

const collections = [
	{ name: "Coffee & Tea", image: "/scraped-10.png", href: "/collection" },
	{ name: "Tumblers", image: "/scraped-0.png", href: "/collection" },
	{ name: "Accessories", image: "/scraped-11.png", href: "/collection" },
	{ name: "Bottles", image: "/scraped-7.png", href: "/collection" },
	{ name: "Cup", image: "/scraped-10.png", href: "/collection" },
];

export function CollectionCarousel() {
	return (
		<section className="py-16 sm:py-20 overflow-hidden bg-background">
			<div className="flex gap-6 animate-marquee" style={{ width: "max-content" }}>
				{[...collections, ...collections, ...collections].map((col, i) => (
					<YnsLink
						prefetch={"eager"}
						key={`col-${i}`}
						href={col.href}
						className="group flex-shrink-0 w-[280px]"
					>
						<div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-secondary">
							<Image
								src={col.image}
								alt={col.name}
								fill
								className="object-cover transition-transform duration-500 group-hover:scale-105"
								sizes="280px"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
							<div className="absolute bottom-4 left-4 right-4">
								<h3 className="text-white text-lg font-medium">{col.name}</h3>
								<span className="text-white/70 text-sm">View item</span>
							</div>
						</div>
					</YnsLink>
				))}
			</div>
		</section>
	);
}
