import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-hero-cream grain">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[520px] lg:min-h-[640px] py-16 lg:py-0">
					{/* Left: headline */}
					<div className="lg:col-span-5 relative z-10">
						<p className="font-script text-2xl sm:text-3xl text-espresso/80 mb-4">Meet the</p>
						<h1 className="font-condensed text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] leading-[0.92] uppercase text-espresso tracking-tight">
							Sparkling
							<br />
							Espresso
							<br />
							Spritz
						</h1>
						<p className="mt-8 text-base text-espresso/70 max-w-md leading-relaxed">
							Small-batch, slow-roasted, sparkling. Crafted with organic ingredients and fair-trade espresso
							for the brightest sip in the room.
						</p>
						<div className="mt-10 flex flex-wrap gap-4">
							<YnsLink prefetch={"eager"} href="#products" className="btn-outline-espresso">
								Shop Now
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="#about"
								className="text-espresso/70 hover:text-espresso transition-colors text-[11px] uppercase tracking-[0.22em] font-medium inline-flex items-center gap-2 py-[0.85rem]"
							>
								Our Story →
							</YnsLink>
						</div>
					</div>

					{/* Right: hero composition with SVG cans + scraped image accent */}
					<div className="lg:col-span-7 relative h-[420px] sm:h-[520px] lg:h-[640px]">
						<HeroComposition />
					</div>
				</div>
			</div>
		</section>
	);
}

function HeroComposition() {
	return (
		<div className="absolute inset-0 flex items-end justify-center">
			{/* Soft ground shadow */}
			<div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[80%] h-8 bg-espresso/15 blur-2xl rounded-full" />

			{/* Decorative citrus image behind cans */}
			<div className="absolute left-2 sm:left-6 bottom-20 sm:bottom-28 w-32 sm:w-44 lg:w-56 aspect-square rounded-full overflow-hidden shadow-xl ring-4 ring-cream/40 rotate-[-8deg]">
				<Image
					src="/scraped-0.jpg"
					alt=""
					fill
					sizes="(max-width: 640px) 8rem, 14rem"
					className="object-cover"
					priority
				/>
			</div>

			{/* Three SVG "cans" mimicking the Esprizio composition */}
			<div className="relative flex items-end gap-3 sm:gap-5 lg:gap-7 pb-16 sm:pb-20 lg:pb-24 z-10">
				<HeroCan flavor="Blood Orange" topColor="#c0512b" bottomColor="#8a3a1f" rotate="-4deg" />
				<HeroCan
					flavor="Tangerine Chocolate"
					topColor="#e8a66a"
					bottomColor="#a86836"
					rotate="0deg"
					translateY="-18px"
				/>
				<HeroCan flavor="Grapefruit" topColor="#d86a5c" bottomColor="#a8463a" rotate="4deg" />
			</div>

			{/* Garnish image accent on the right */}
			<div className="absolute right-2 sm:right-6 bottom-12 sm:bottom-20 w-28 sm:w-36 lg:w-44 aspect-square rounded-full overflow-hidden shadow-xl ring-4 ring-cream/40 rotate-[6deg]">
				<Image
					src="/scraped-1.jpg"
					alt=""
					fill
					sizes="(max-width: 640px) 7rem, 11rem"
					className="object-cover"
				/>
			</div>
		</div>
	);
}

function HeroCan({
	flavor,
	topColor,
	bottomColor,
	rotate = "0deg",
	translateY = "0",
}: {
	flavor: string;
	topColor: string;
	bottomColor: string;
	rotate?: string;
	translateY?: string;
}) {
	return (
		<div
			className="relative w-[110px] sm:w-[140px] lg:w-[180px] aspect-[0.45] drop-shadow-2xl"
			style={{ transform: `rotate(${rotate}) translateY(${translateY})` }}
		>
			<svg viewBox="0 0 180 400" className="w-full h-full" aria-hidden="true">
				<defs>
					<linearGradient id={`can-${flavor}`} x1="0" x2="1" y1="0" y2="0">
						<stop offset="0%" stopColor="#000" stopOpacity="0.25" />
						<stop offset="50%" stopColor="#fff" stopOpacity="0" />
						<stop offset="100%" stopColor="#000" stopOpacity="0.25" />
					</linearGradient>
					<linearGradient id={`label-${flavor}`} x1="0" x2="0" y1="0" y2="1">
						<stop offset="0%" stopColor="#f5efe2" />
						<stop offset="50%" stopColor="#f5efe2" />
						<stop offset="50.1%" stopColor={topColor} />
						<stop offset="100%" stopColor={bottomColor} />
					</linearGradient>
					<clipPath id={`clip-${flavor}`}>
						<rect x="10" y="20" width="160" height="360" rx="14" />
					</clipPath>
				</defs>
				{/* Top rim */}
				<ellipse cx="90" cy="22" rx="78" ry="8" fill="#9b8f72" />
				<ellipse cx="90" cy="20" rx="78" ry="6" fill="#cdbf9b" />
				{/* Body */}
				<g clipPath={`url(#clip-${flavor})`}>
					<rect x="10" y="20" width="160" height="360" fill={`url(#label-${flavor})`} />
					{/* Cream top half — typography */}
					<text
						x="90"
						y="65"
						textAnchor="middle"
						fontSize="9"
						fill="#3b1f14"
						fontStyle="italic"
						fontFamily="serif"
					>
						sparkling
					</text>
					<text
						x="90"
						y="80"
						textAnchor="middle"
						fontSize="9"
						fill="#3b1f14"
						letterSpacing="1.2"
						fontFamily="serif"
					>
						ESPRESSO
					</text>
					<text
						x="90"
						y="93"
						textAnchor="middle"
						fontSize="9"
						fill="#3b1f14"
						letterSpacing="1.5"
						fontFamily="serif"
					>
						SPRITZ
					</text>
					<text
						x="90"
						y="148"
						textAnchor="middle"
						fontSize="28"
						fill="#3b1f14"
						fontStyle="italic"
						fontFamily="serif"
						fontWeight="600"
					>
						YNS
					</text>
					{/* Seal between halves */}
					<circle cx="90" cy="200" r="22" fill="#3b1f14" />
					<circle cx="90" cy="200" r="19" fill="none" stroke="#f5efe2" strokeWidth="0.6" />
					<text
						x="90"
						y="204"
						textAnchor="middle"
						fontSize="6.5"
						fill="#f5efe2"
						letterSpacing="0.8"
						fontFamily="serif"
					>
						ORIGINAL
					</text>
					{/* Flavor (script) bottom half */}
					<text
						x="90"
						y="270"
						textAnchor="middle"
						fontSize="20"
						fill="#f5efe2"
						fontStyle="italic"
						fontFamily="cursive"
					>
						{flavor.split(" ")[0]}
					</text>
					{flavor.split(" ")[1] && (
						<text
							x="90"
							y="294"
							textAnchor="middle"
							fontSize="20"
							fill="#f5efe2"
							fontStyle="italic"
							fontFamily="cursive"
						>
							{flavor.split(" ")[1]}
						</text>
					)}
					{/* Fine print */}
					<text x="90" y="345" textAnchor="middle" fontSize="5.5" fill="#f5efe2" letterSpacing="0.5">
						8.4 FL OZ / 250 ML
					</text>
				</g>
				{/* Side light/shadow */}
				<rect
					x="10"
					y="20"
					width="160"
					height="360"
					rx="14"
					fill={`url(#can-${flavor})`}
					pointerEvents="none"
				/>
				<rect x="10" y="20" width="160" height="360" rx="14" fill="none" stroke="#000" strokeOpacity="0.08" />
			</svg>
		</div>
	);
}
