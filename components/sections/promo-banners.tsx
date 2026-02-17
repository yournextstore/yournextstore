import Image from "next/image";
import { YnsLink } from "../yns-link";

const banners = [
	{
		image: "/scraped-3.png",
		label: "LAMPS & LIGHTS",
		title: "MEGA SALE",
		subtitle: "FROM $450",
		href: "/products",
		overlay: "bg-gradient-to-t from-sky-600/80 to-sky-500/50",
	},
	{
		image: "/scraped-4.png",
		label: "BODY PARTS",
		title: "FOR ANY VEHICLE",
		subtitle: "COUPE, SEDAN, SUV AND MANY MORE",
		href: "/products",
		overlay: "bg-gradient-to-t from-neutral-800/80 to-neutral-700/50",
	},
	{
		image: "/scraped-5.png",
		label: "ENGINE",
		title: "SYSTEM",
		subtitle: "PRICES REDUCTION",
		href: "/products",
		overlay: "bg-gradient-to-t from-neutral-900/80 to-neutral-800/50",
	},
];

export function PromoBanners() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				{banners.map((banner) => (
					<YnsLink
						prefetch={"eager"}
						key={banner.label}
						href={banner.href}
						className="group relative block overflow-hidden h-48 sm:h-56"
					>
						<Image
							src={banner.image}
							alt={banner.label}
							fill
							className="object-cover transition-transform duration-500 group-hover:scale-105"
							sizes="(max-width: 640px) 100vw, 33vw"
						/>
						<div className={`absolute inset-0 ${banner.overlay}`} />
						<div className="relative z-10 h-full flex flex-col justify-end p-5 text-white">
							<p className="font-heading text-xs font-semibold uppercase tracking-widest opacity-80">
								{banner.label}
							</p>
							<h3 className="font-heading text-xl sm:text-2xl font-bold uppercase leading-tight">
								{banner.title}
							</h3>
							<p className="text-xs mt-1 uppercase opacity-80">{banner.subtitle}</p>
							<span className="mt-2 text-xs font-semibold uppercase tracking-wider text-brand hover:text-yellow-300 transition-colors">
								View Details
							</span>
						</div>
					</YnsLink>
				))}
			</div>
		</section>
	);
}
