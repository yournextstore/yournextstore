import Image from "next/image";
import Link from "next/link";
import { SlideshowControls } from "@/components/sections/slideshow-controls";

const slides = [
	{
		title: "Plants for real rooms",
		description:
			"Easy-going houseplants, good planters and the kit to keep them growing. Find the right plant for your light.",
		image: "/images/pexels/slide-green-bag.jpg",
		alt: "Spider plants, a calathea and snake plants in charcoal pots on stepped stone plinths.",
	},
	{
		title: "Big leaves, bright corners",
		description: "Monstera, bird of paradise and fiddle leaf fig: floor plants that fill a room.",
		image: "/images/pexels/slide-woven-bags.jpg",
		alt: "A monstera and a bird of paradise in cream floor pots beside a bright window.",
	},
	{
		title: "Pots, baskets and care",
		description: "Ceramic and terracotta planters, woven baskets, misters and plant food.",
		image: "/images/pexels/slide-handbags.jpg",
		alt: "Small houseplants in cream, sage and terracotta pots and woven baskets on an oak table.",
	},
];

/**
 * Soul's full-bleed slideshow: 80vh photographs under a dark bottom gradient, a serif headline,
 * a white pill CTA, progress bars, a "01/03" counter and a play/pause toggle. Every slide is
 * server-rendered and stacked; the client controls only cross-fade them.
 */
export function Hero() {
	return (
		<section
			id="slideshow"
			aria-roledescription="carousel"
			aria-label="Featured"
			className="relative h-[80vh] min-h-[28rem] overflow-hidden bg-lime-shadow"
		>
			{slides.map((slide, index) => (
				<div
					key={slide.image}
					data-slide={index}
					aria-hidden={index === 0 ? undefined : true}
					className="absolute inset-0 transition-opacity duration-700 ease-out data-[active=false]:pointer-events-none data-[active=false]:opacity-0"
					data-active={index === 0}
				>
					<Image
						src={slide.image}
						alt={slide.alt}
						fill
						sizes="100vw"
						preload={index === 0}
						quality={70}
						className="object-cover"
					/>
					<div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-foreground/80 to-transparent">
						<div className="mx-auto w-full max-w-[96rem] px-4 pt-12 pb-16 text-balance sm:px-6 sm:pt-16 sm:pb-20 lg:px-8 lg:pt-20">
							{index === 0 ? (
								<h1 className="max-w-xl text-4xl leading-none text-background md:text-5xl md:leading-[.9] lg:text-display">
									{slide.title}
								</h1>
							) : (
								<p className="max-w-xl font-heading text-4xl leading-none text-background md:text-5xl md:leading-[.9] lg:text-display">
									{slide.title}
								</p>
							)}
							<p className="mt-2 max-w-xl text-base leading-normal text-background/80 sm:mt-3 sm:text-lg">
								{slide.description}
							</p>
							<Link
								href="/products"
								tabIndex={index === 0 ? undefined : -1}
								className="btn-soul btn-tertiary mt-6 min-h-14 px-6 py-4 text-base sm:mt-8"
							>
								Shop Now
							</Link>
						</div>
					</div>
				</div>
			))}
			<SlideshowControls count={slides.length} />
		</section>
	);
}
