import Image from "next/image";
import { YnsLink } from "../yns-link";

const categories = [
	{ image: "/scraped-4.jpg", name: "Engine Parts", href: "#products" },
	{ image: "/scraped-5.jpg", name: "Alternators", href: "#products" },
	{ image: "/scraped-6.jpg", name: "Wiring & Cables", href: "#products" },
	{ image: "/scraped-8.jpg", name: "Motors & Pumps", href: "#products" },
	{ image: "/scraped-10.jpg", name: "Starters", href: "#products" },
	{ image: "/scraped-14.jpg", name: "Electrical", href: "#products" },
];

export function CategoryShowcase() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold uppercase text-foreground mb-8 text-center">
				Shop By Category
			</h2>
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
				{categories.map((cat) => (
					<YnsLink
						prefetch={"eager"}
						key={cat.name}
						href={cat.href}
						className="group flex flex-col items-center text-center"
					>
						<div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-secondary border-2 border-transparent group-hover:border-primary transition-colors mb-3">
							<Image
								src={cat.image}
								alt={cat.name}
								fill
								className="object-cover group-hover:scale-110 transition-transform duration-300"
							/>
						</div>
						<span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
							{cat.name}
						</span>
					</YnsLink>
				))}
			</div>
		</section>
	);
}
