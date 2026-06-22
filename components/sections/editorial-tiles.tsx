import Image from "next/image";
import { YnsLink } from "../yns-link";

const tiles = [
	{
		eyebrow: "The Edit",
		title: "Pre-Spring Tailoring",
		image: "/scraped-0.jpg",
		href: "/products",
	},
	{
		eyebrow: "Just Landed",
		title: "Soft Suiting",
		image: "/scraped-1.jpg",
		href: "/products",
	},
	{
		eyebrow: "Refined",
		title: "Knits & Layers",
		image: "/scraped-2.jpg",
		href: "/products",
	},
	{
		eyebrow: "Accessories",
		title: "Quiet Luxury",
		image: "/scraped-3.jpg",
		href: "/products",
	},
];

export function EditorialTiles() {
	return (
		<section id="editorial" className="bg-background">
			<div className="mx-auto max-w-[1600px] px-6 pt-20 pb-6 lg:px-10">
				<div className="mb-10 flex items-end justify-between">
					<div>
						<p className="eyebrow text-mushroom">Shop the Season</p>
						<h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl lg:text-[44px] lg:tracking-[-0.02em]">
							The Pre-Spring Edit
						</h2>
					</div>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="hidden sm:inline-flex text-sm font-medium text-foreground underline underline-offset-[6px] decoration-[1px] hover:decoration-2 transition-all"
					>
						View All
					</YnsLink>
				</div>
				<div className="grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-4 lg:gap-x-5">
					{tiles.map((tile) => (
						<YnsLink prefetch={"eager"} key={tile.title} href={tile.href} className="group block">
							<div className="relative aspect-[3/4] overflow-hidden bg-cream">
								<Image
									src={tile.image}
									alt={tile.title}
									fill
									sizes="(max-width: 1024px) 50vw, 25vw"
									className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
							</div>
							<div className="mt-4">
								<p className="eyebrow text-mushroom">{tile.eyebrow}</p>
								<h3 className="mt-1.5 font-display text-lg text-foreground">{tile.title}</h3>
								<p className="mt-1 text-sm text-mushroom underline underline-offset-4 decoration-[1px] group-hover:decoration-2 transition-all">
									Shop Now
								</p>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
