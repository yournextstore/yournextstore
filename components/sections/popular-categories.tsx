import Image from "next/image";
import { YnsLink } from "../yns-link";

const popularCategories = [
	{ name: "KNITWEAR", image: "/scraped-9.png", href: "/products" },
	{ name: "BEANIES", image: "/scraped-10.png", href: "/products" },
	{ name: "ACCESSORIES", image: "/scraped-11.png", href: "/products" },
];

export function PopularCategories() {
	return (
		<section className="py-16 sm:py-24">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight mb-10">
					Popular Categories
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
					{popularCategories.map((cat) => (
						<YnsLink
							prefetch={"eager"}
							key={cat.name}
							href={cat.href}
							className="group relative aspect-[4/5] overflow-hidden bg-secondary"
						>
							<Image
								src={cat.image}
								alt={cat.name}
								fill
								className="object-cover transition-transform duration-500 group-hover:scale-105"
								sizes="(max-width: 640px) 100vw, 33vw"
							/>
							<div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
							<div className="absolute bottom-6 left-6">
								<span className="text-white text-xl font-extrabold uppercase tracking-wide">{cat.name}</span>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
