import Image from "next/image";
import { YnsLink } from "../yns-link";

const banners = [
	{
		image: "/scraped-4.jpg",
		highlight: "LAMPS & LIGHTS",
		title: "MEGA SALE",
		subtitle: "FROM $450",
		href: "#products",
	},
	{
		image: "/scraped-5.jpg",
		highlight: "BODY PARTS",
		title: "FOR ANY VEHICLE",
		subtitle: "COUPE, SEDAN, SUV AND MORE",
		href: "#products",
	},
	{
		image: "/scraped-7.jpg",
		highlight: "ENGINE",
		title: "SYSTEM",
		subtitle: "PRICES REDUCTION",
		href: "#products",
	},
];

export function BannerGrid() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				{banners.map((banner) => (
					<YnsLink
						prefetch={"eager"}
						key={banner.title}
						href={banner.href}
						className="group relative overflow-hidden bg-[#1a1a1a] h-48 sm:h-56 flex items-center"
					>
						<Image
							src={banner.image}
							alt={banner.title}
							fill
							className="object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500 group-hover:scale-105"
						/>
						<div className="relative z-10 p-6 text-white">
							<p className="text-gold font-[family-name:var(--font-heading)] text-xs uppercase tracking-widest">
								{banner.highlight}
							</p>
							<h3 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl font-bold uppercase mt-1">
								{banner.title}
							</h3>
							<p className="text-white/60 text-xs uppercase tracking-wide mt-1">{banner.subtitle}</p>
							<span className="inline-block mt-3 text-primary text-xs font-semibold uppercase tracking-wider hover:text-gold transition-colors">
								View Details
							</span>
						</div>
					</YnsLink>
				))}
			</div>
		</section>
	);
}
