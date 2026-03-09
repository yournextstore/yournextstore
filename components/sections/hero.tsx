import Image from "next/image";
import { YnsLink } from "../yns-link";

const heroSlides = [
	{
		label: "NEW COLLECTION",
		title: "Jackets & Liners",
		cta: "Explore all",
		href: "/products",
		image: "/scraped-0.png",
	},
	{
		label: "SALE! UP TO 50% OFF!",
		title: "Popular Accessories",
		cta: "Shop now",
		href: "/products",
		image: "/scraped-1.png",
	},
	{
		label: "SPRING / SUMMER 2025",
		title: "LOOKBOOK",
		cta: "Learn more",
		href: "/products",
		image: "/scraped-2.png",
	},
];

export function Hero() {
	return (
		<section className="w-full">
			<div className="grid grid-cols-1 md:grid-cols-3 min-h-[70vh]">
				{heroSlides.map((slide) => (
					<div
						key={slide.title}
						className="relative group overflow-hidden cursor-pointer min-h-[50vh] md:min-h-[70vh]"
					>
						{/* Background Image */}
						<Image
							src={slide.image}
							alt={slide.title}
							fill
							className="object-cover transition-transform duration-700 group-hover:scale-105"
							sizes="(max-width: 768px) 100vw, 33vw"
							priority
						/>

						{/* Dark Overlay */}
						<div className="absolute inset-0 bg-black/30 transition-opacity duration-500 group-hover:bg-black/40" />

						{/* Content */}
						<div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-10">
							<span className="text-[10px] tracking-[0.3em] uppercase text-white/80 font-medium mb-3">
								{slide.label}
							</span>
							<h2 className="text-2xl lg:text-3xl font-medium text-white mb-6 leading-tight">
								{slide.title}
							</h2>
							<YnsLink
								prefetch={"eager"}
								href={slide.href}
								className="inline-flex items-center text-xs tracking-[0.2em] uppercase text-white font-medium border-b border-white/50 pb-1 hover:border-white transition-colors self-start"
							>
								{slide.cta}
							</YnsLink>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
