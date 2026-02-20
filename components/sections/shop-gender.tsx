import Image from "next/image";
import { YnsLink } from "../yns-link";

const categories = [
	{
		label: "Great Deals!",
		title: "SHOP MEN",
		cta: "SHOP NOW",
		href: "/products",
		image: "/scraped-6.png",
	},
	{
		label: "Save up to 50%",
		title: "SHOP WOMEN",
		cta: "SHOP NOW",
		href: "/products",
		image: "/scraped-7.png",
	},
];

export function ShopGender() {
	return (
		<section className="w-full">
			<div className="grid grid-cols-1 md:grid-cols-2">
				{categories.map((cat) => (
					<div key={cat.title} className="relative group overflow-hidden min-h-[60vh]">
						<Image
							src={cat.image}
							alt={cat.title}
							fill
							className="object-cover transition-transform duration-700 group-hover:scale-105"
							sizes="(max-width: 768px) 100vw, 50vw"
						/>
						<div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-opacity duration-500" />
						<div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12">
							<span className="text-[10px] tracking-[0.3em] uppercase text-white/80 font-medium mb-2">
								{cat.label}
							</span>
							<h2 className="text-2xl lg:text-3xl font-medium text-white mb-5">{cat.title}</h2>
							<YnsLink
								prefetch={"eager"}
								href={cat.href}
								className="inline-flex items-center justify-center px-8 py-3 bg-white text-foreground text-xs tracking-[0.2em] uppercase font-medium hover:bg-white/90 transition-colors self-start"
							>
								{cat.cta}
							</YnsLink>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
