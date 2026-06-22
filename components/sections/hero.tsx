import Image from "next/image";
import { YnsLink } from "../yns-link";

const heroBars = [
	{ src: "/scraped-0.jpg", alt: "Cocoa almond bar", rotation: "-rotate-1" },
	{ src: "/scraped-1.jpg", alt: "Honey oat bar", rotation: "rotate-0" },
	{ src: "/scraped-2.jpg", alt: "Caramel cashew bar", rotation: "rotate-1" },
];

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-hero-grain">
			<div
				aria-hidden="true"
				className="absolute inset-0 opacity-[0.06] mix-blend-screen pointer-events-none"
				style={{
					backgroundImage:
						"url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 0.96  0 0 0 0 0.88  0 0 0 0.35 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
				}}
			/>

			<div className="relative max-w-screen-2xl mx-auto px-4 sm:px-8">
				<div className="pt-20 sm:pt-28 lg:pt-32 pb-0 text-center">
					<p className="font-display tracking-[0.32em] text-[11px] sm:text-xs text-bronze-light mb-6">
						WHOLE-FOOD ENERGY · HONEY SWEETENED
					</p>
					<h1 className="text-display-mega text-cream text-[18vw] sm:text-[15vw] lg:text-[13vw] xl:text-[12rem]">
						<span className="block">FUEL YOUR</span>
						<span className="block">EVERYDAY.</span>
					</h1>
					<div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center items-center">
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="inline-flex items-center justify-center h-12 px-10 bg-cream text-espresso font-display tracking-[0.18em] text-sm hover:bg-bronze-light transition-colors"
						>
							SHOP THE BARS
						</YnsLink>
						<YnsLink
							prefetch={"eager"}
							href="#story"
							className="inline-flex items-center justify-center h-12 px-10 border border-cream/30 text-cream font-display tracking-[0.18em] text-sm hover:border-bronze-light hover:text-bronze-light transition-colors"
						>
							OUR STORY
						</YnsLink>
					</div>
				</div>

				<div className="relative mt-12 sm:mt-16 lg:mt-20 grid grid-cols-3 gap-3 sm:gap-8 px-2 sm:px-12 max-w-5xl mx-auto">
					{heroBars.map((bar) => (
						<div
							key={bar.src}
							className={`relative aspect-[3/5] ${bar.rotation} drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)]`}
						>
							<Image
								src={bar.src}
								alt={bar.alt}
								fill
								priority
								sizes="(max-width: 768px) 33vw, 300px"
								className="object-contain object-bottom"
							/>
						</div>
					))}
				</div>

				<div
					aria-hidden="true"
					className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-cocoa to-transparent pointer-events-none"
				/>
			</div>
		</section>
	);
}
