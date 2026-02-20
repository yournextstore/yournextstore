import Image from "next/image";
import { YnsLink } from "../yns-link";

const categories = [
	{ name: "T-shirts", image: "/scraped-3.png", href: "/products" },
	{ name: "Jackets", image: "/scraped-4.png", href: "/products" },
	{ name: "Pants", image: "/scraped-5.png", href: "/products" },
	{ name: "Fleeces", image: "/scraped-6.png", href: "/products" },
	{ name: "Basics", image: "/scraped-7.png", href: "/products" },
	{ name: "Shirts", image: "/scraped-8.png", href: "/products" },
];

export function ShopByCategory() {
	return (
		<section className="py-16 sm:py-24">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight mb-10">
					Shop by category
				</h2>
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
					{categories.map((cat) => (
						<YnsLink prefetch={"eager"} key={cat.name} href={cat.href} className="group">
							<div className="relative aspect-[3/4] overflow-hidden bg-secondary">
								<Image
									src={cat.image}
									alt={cat.name}
									fill
									className="object-cover transition-transform duration-500 group-hover:scale-105"
									sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
								/>
							</div>
							<p className="mt-3 text-sm font-bold uppercase tracking-wide text-center">{cat.name}</p>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
