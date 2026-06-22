import Image from "next/image";
import { YnsLink } from "../yns-link";

const cards = [
	{
		title: "The Polo",
		caption: "Brushed cotton, worn-in",
		href: "/products",
		image: "/scraped-0.jpg",
		span: "lg:col-span-4",
	},
	{
		title: "Quiet Tailoring",
		caption: "Wide-leg, undone",
		href: "/products",
		image: "/scraped-2.jpg",
		span: "lg:col-span-5",
	},
	{
		title: "Tortoise Lens",
		caption: "Acetate frames, AC22",
		href: "/products",
		image: "/scraped-5.jpg",
		span: "lg:col-span-3",
	},
];

export function LookbookStrip() {
	return (
		<section className="bg-background">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pb-20 sm:pb-28">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6">
					{cards.map((card, idx) => (
						<YnsLink
							key={card.title}
							href={card.href}
							prefetch={"eager"}
							className={`group relative overflow-hidden rounded-[20px] ring-1 ring-border/60 aspect-[3/4] sm:aspect-[4/5] ${card.span} ${
								idx === 1 ? "lg:translate-y-10" : ""
							}`}
						>
							<Image
								src={card.image}
								alt={card.title}
								fill
								sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
								className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-charcoal/55 via-transparent to-transparent" />

							{/* Floating tag — top right */}
							<div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-bone/90 backdrop-blur-md text-charcoal text-[11px] tracking-wider font-medium tabular-nums shadow-sm">
								Edit № 0{idx + 1}
							</div>

							{/* Caption — bottom left */}
							<div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex items-end justify-between gap-3">
								<div>
									<p className="font-display text-bone text-xl sm:text-2xl leading-tight">{card.title}</p>
									<p className="mt-1 text-bone/75 text-xs tracking-wider">{card.caption}</p>
								</div>
								<span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-bone text-charcoal text-base font-display transition-all duration-300 group-hover:bg-clay group-hover:rotate-12">
									→
								</span>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
