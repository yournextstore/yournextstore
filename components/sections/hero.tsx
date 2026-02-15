import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

const slides = [
	{
		image: "/scraped-6.jpg",
		label: "New Release",
		title: "Next-Gen Gaming PCs Have Arrived",
		description: "Experience smooth gameplay, ultra-fast load times, and elite graphics.",
	},
	{
		image: "/scraped-5.jpg",
		title: "Power That Starts at the Core",
		label: "New Release",
		description: "More than a processor — it's the engine behind your gameplay and performance.",
	},
	{
		image: "/scraped-0.jpg",
		label: "Exclusive",
		title: "Engineered for the Modern Gaming World",
		description: "Unmatched power meets sleek design. Level up your setup today.",
	},
];

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-background">
			{/* Primary Hero Slide */}
			<div className="relative h-[70vh] min-h-[500px] max-h-[800px]">
				<Image src={slides[0].image} alt={slides[0].title} fill className="object-cover" priority />
				<div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
				<div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

				<div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
					<div className="max-w-xl">
						<span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary border border-primary/30 rounded-sm mb-6">
							{slides[0].label}
						</span>
						<h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold uppercase leading-[1.1] tracking-tight text-foreground">
							{slides[0].title}
						</h1>
						<p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-md">
							{slides[0].description}
						</p>
						<div className="mt-8 flex flex-col sm:flex-row gap-4">
							<YnsLink
								prefetch={"eager"}
								href="#products"
								className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-primary text-primary-foreground rounded-sm text-sm font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors"
							>
								Shop Now
								<ArrowRightIcon className="h-4 w-4" />
							</YnsLink>
						</div>
					</div>
				</div>
			</div>

			{/* Secondary Hero Banners */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{slides.slice(1).map((slide) => (
						<YnsLink
							prefetch={"eager"}
							key={slide.title}
							href="#products"
							className="group relative h-64 rounded-lg overflow-hidden"
						>
							<Image
								src={slide.image}
								alt={slide.title}
								fill
								className="object-cover transition-transform duration-700 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
							<div className="absolute bottom-0 left-0 p-6">
								<p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
									{slide.label}
								</p>
								<h3 className="font-heading text-xl font-bold uppercase text-foreground">{slide.title}</h3>
								<p className="mt-1 text-sm text-muted-foreground">{slide.description}</p>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
