import Image from "next/image";
import { YnsLink } from "../yns-link";

const rail = [
	{ label: "Wool Trousers", image: "/scraped-5.jpg" },
	{ label: "The Trench", image: "/scraped-0.jpg" },
	{ label: "Soft Knits", image: "/scraped-2.jpg" },
	{ label: "Slip Dresses", image: "/scraped-1.jpg" },
	{ label: "Leather", image: "/scraped-3.jpg" },
	{ label: "Heels & Slingbacks", image: "/scraped-4.jpg" },
];

export function TrendingRail() {
	return (
		<section className="bg-cream">
			<div className="mx-auto max-w-[1600px] px-6 py-20 lg:px-10">
				<div className="mb-10 flex items-end justify-between">
					<div>
						<p className="eyebrow text-mushroom">Now Trending</p>
						<h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">In Focus</h2>
					</div>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="text-sm font-medium text-foreground underline underline-offset-[6px] decoration-[1px] hover:decoration-2 transition-all"
					>
						See All Categories
					</YnsLink>
				</div>
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
					{rail.map((item) => (
						<YnsLink
							prefetch={"eager"}
							key={item.label}
							href="/products"
							className="group relative block aspect-[3/4] overflow-hidden bg-bone"
						>
							<Image
								src={item.image}
								alt={item.label}
								fill
								sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
								className="object-cover transition-transform duration-700 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
							<div className="absolute inset-x-0 bottom-0 p-4">
								<p className="font-display text-base text-cream lg:text-lg">{item.label}</p>
								<p className="mt-1 inline-block eyebrow text-cream/80 underline underline-offset-4 decoration-[1px] opacity-0 transition-opacity group-hover:opacity-100">
									Shop
								</p>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
