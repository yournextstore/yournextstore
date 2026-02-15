import Image from "next/image";
import { YnsLink } from "../yns-link";

const cards = [
	{
		image: "/scraped-13.jpg",
		label: "The Vacation Shop",
		title: "Show your Sparkle",
		description: "We create safe products that really work and are designed to make you feel good",
		cta: "Shop Makeup",
		href: "/products",
	},
	{
		image: "/scraped-0.jpg",
		label: "The Vacation Shop",
		title: "Care for Your Beauty",
		description: "We create safe products that really work and are designed to make you feel good",
		cta: "Shop Skincare",
		href: "/products",
	},
	{
		image: "/scraped-2.jpg",
		label: "The Vacation Shop",
		title: "Care for Your Beauty",
		description: "We create safe products that really work and are designed to make you feel good",
		cta: "Shop Accessories",
		href: "/products",
	},
];

export function HotThisWeek() {
	return (
		<section className="py-16 sm:py-24">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-light text-foreground mb-8">
					Hot this week
				</h2>

				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
					{cards.map((card) => (
						<YnsLink
							key={card.title + card.cta}
							prefetch={"eager"}
							href={card.href}
							className="group relative rounded-xl overflow-hidden"
						>
							<div className="relative aspect-[3/4]">
								<Image
									src={card.image}
									alt={card.title}
									fill
									className="object-cover transition-transform duration-500 group-hover:scale-105"
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
							</div>

							<div className="absolute bottom-0 left-0 right-0 p-6 text-white">
								<p className="text-xs tracking-widest uppercase mb-1 opacity-80">{card.label}</p>
								<h3 className="font-heading text-2xl font-light mb-2">{card.title}</h3>
								<p className="text-sm opacity-80 mb-4 line-clamp-2">{card.description}</p>
								<span className="text-sm font-medium tracking-wide uppercase underline underline-offset-4">
									{card.cta}
								</span>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
