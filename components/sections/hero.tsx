import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden">
			{/* Lavender gradient backdrop with grain */}
			<div className="relative yns-hero-gradient yns-grain min-h-[68vh] sm:min-h-[78vh] flex items-end">
				{/* Editorial portraits — abstract silhouettes via SVG (no portrait imagery, just texture) */}
				<svg
					className="absolute inset-0 w-full h-full"
					viewBox="0 0 1600 900"
					preserveAspectRatio="xMidYMid slice"
					aria-hidden="true"
				>
					<defs>
						<radialGradient id="hero-glow" cx="50%" cy="35%" r="55%">
							<stop offset="0%" stopColor="#d8c9e0" stopOpacity="0.55" />
							<stop offset="55%" stopColor="#9b8fb8" stopOpacity="0.0" />
						</radialGradient>
						<linearGradient id="hair-strand" x1="0" x2="0" y1="0" y2="1">
							<stop offset="0%" stopColor="#2B2530" stopOpacity="0.75" />
							<stop offset="100%" stopColor="#2B2530" stopOpacity="0.15" />
						</linearGradient>
					</defs>
					<rect width="1600" height="900" fill="url(#hero-glow)" />
					{/* Soft braided strand suggestions */}
					<g opacity="0.32">
						<path
							d="M120 600 Q160 700 140 900"
							stroke="url(#hair-strand)"
							strokeWidth="60"
							strokeLinecap="round"
							fill="none"
						/>
						<path
							d="M220 650 Q260 760 230 900"
							stroke="url(#hair-strand)"
							strokeWidth="40"
							strokeLinecap="round"
							fill="none"
						/>
						<path
							d="M1380 580 Q1420 720 1460 900"
							stroke="url(#hair-strand)"
							strokeWidth="56"
							strokeLinecap="round"
							fill="none"
						/>
						<path
							d="M1500 620 Q1530 760 1560 900"
							stroke="url(#hair-strand)"
							strokeWidth="34"
							strokeLinecap="round"
							fill="none"
						/>
					</g>
					{/* Bead accents */}
					<g fill="#f5f1ec" opacity="0.75">
						<circle cx="160" cy="510" r="4" />
						<circle cx="142" cy="540" r="3" />
						<circle cx="180" cy="555" r="3" />
						<circle cx="1420" cy="500" r="4" />
						<circle cx="1450" cy="525" r="3" />
						<circle cx="1402" cy="545" r="3" />
					</g>
				</svg>

				{/* Vignette for legibility */}
				<div className="absolute inset-0 yns-hero-veil pointer-events-none" />

				{/* Content */}
				<div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pb-12 sm:pb-16 lg:pb-20 pt-24">
					<div className="max-w-3xl">
						<h1
							className="font-serif text-[2.2rem] sm:text-[3.4rem] lg:text-[4.6rem] leading-[1.02] tracking-tight text-cream"
							style={{ color: "#F5F1EC" }}
						>
							Salon-Inspired Care, <span className="italic font-light">Reimagined</span>
							<span className="block sm:inline"> for Texture-Rich Hair</span>
						</h1>

						<div className="mt-7 sm:mt-9">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex items-center justify-center h-12 px-9 bg-transparent border border-cream/85 text-cream text-[11px] font-medium tracking-[0.22em] uppercase hover:bg-cream hover:text-plum-deep transition-colors duration-300"
								style={{ borderColor: "#F5F1EC", color: "#F5F1EC" }}
							>
								Shop the Rituals
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
