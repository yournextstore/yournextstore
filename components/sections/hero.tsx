import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden mush-hero-gradient">
			{/* Layered organic mushroom-gill background using inline SVG fans */}
			<svg
				aria-hidden="true"
				className="absolute inset-0 w-full h-full opacity-90 mix-blend-overlay"
				viewBox="0 0 1600 900"
				preserveAspectRatio="xMidYMid slice"
			>
				<defs>
					<radialGradient id="gill" cx="50%" cy="50%" r="60%">
						<stop offset="0%" stopColor="#f5c66b" stopOpacity="0.85" />
						<stop offset="55%" stopColor="#a85a26" stopOpacity="0.55" />
						<stop offset="100%" stopColor="#3d1f0f" stopOpacity="0" />
					</radialGradient>
					<radialGradient id="gillSoft" cx="50%" cy="50%" r="60%">
						<stop offset="0%" stopColor="#e9b248" stopOpacity="0.55" />
						<stop offset="100%" stopColor="#3d1f0f" stopOpacity="0" />
					</radialGradient>
				</defs>
				{Array.from({ length: 14 }).map((_, i) => {
					const angle = -25 + i * 5;
					return (
						<ellipse
							key={`gill-${angle}`}
							cx="1180"
							cy="500"
							rx="640"
							ry="70"
							fill="url(#gill)"
							transform={`rotate(${angle} 1180 500)`}
						/>
					);
				})}
				{Array.from({ length: 10 }).map((_, i) => {
					const angle = 10 + i * 7;
					return (
						<ellipse
							key={`gillb-${angle}`}
							cx="320"
							cy="780"
							rx="520"
							ry="55"
							fill="url(#gillSoft)"
							transform={`rotate(${angle} 320 780)`}
							opacity="0.7"
						/>
					);
				})}
			</svg>
			{/* Darkening overlay to keep text legible */}
			<div
				aria-hidden="true"
				className="absolute inset-0 bg-gradient-to-r from-[#1a0a04]/70 via-[#1a0a04]/30 to-transparent"
			/>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-24 sm:py-32 lg:py-40 min-h-[560px] flex items-center">
					<div className="max-w-xl">
						<h1 className="leading-none">
							<span className="block font-script text-6xl sm:text-7xl lg:text-8xl text-white drop-shadow-[2px_4px_0_rgba(0,0,0,0.25)]">
								Thrive
							</span>
							<span className="block font-display text-5xl sm:text-6xl lg:text-7xl text-white tracking-tight -mt-2">
								NATURALLY
							</span>
						</h1>
						<p className="mt-8 max-w-md text-base sm:text-lg text-white/85 leading-relaxed">
							Lab-tested functional mushroom tinctures, powders &amp; lattes — regeneratively farmed for
							clarity, calm, and lasting energy.
						</p>
						<div className="mt-10">
							<YnsLink
								prefetch={"eager"}
								href="#products"
								className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-display text-sm tracking-[0.22em] text-[color:var(--color-mush-espresso)] shadow-[0_8px_30px_rgba(0,0,0,0.25)] hover:bg-[color:var(--color-mush-yellow)] transition-colors"
							>
								SHOP NOW
								<span aria-hidden="true" className="text-xl group-hover:translate-x-0.5 transition-transform">
									☞
								</span>
							</YnsLink>
						</div>
					</div>
				</div>
			</div>

			{/* 60-day guarantee badge */}
			<div className="pointer-events-none absolute right-4 sm:right-12 lg:right-24 top-1/2 -translate-y-1/2 hidden sm:block">
				<GuaranteeBadge />
			</div>
		</section>
	);
}

function GuaranteeBadge() {
	return (
		<div className="relative h-32 w-32 lg:h-40 lg:w-40">
			<svg viewBox="0 0 200 200" className="h-full w-full">
				<title>60 day guarantee</title>
				<defs>
					<path id="badgeArc" d="M 100,100 m -72,0 a 72,72 0 1,1 144,0 a 72,72 0 1,1 -144,0" />
				</defs>
				{/* Scalloped edge */}
				<g>
					{Array.from({ length: 28 }).map((_, i) => {
						const angle = (i / 28) * 360;
						return (
							<circle
								key={`scallop-${angle}`}
								cx={100 + 92 * Math.cos((angle * Math.PI) / 180)}
								cy={100 + 92 * Math.sin((angle * Math.PI) / 180)}
								r="10"
								fill="#d9f24a"
							/>
						);
					})}
				</g>
				<circle cx="100" cy="100" r="86" fill="#d9f24a" />
				<circle cx="100" cy="100" r="78" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
				<text fontSize="13" fill="#1a1a1a" fontWeight="700" letterSpacing="1">
					<textPath href="#badgeArc" startOffset="0">
						• GUARANTEE • SATISFACTION • GUARANTEE • SATISFACTION •
					</textPath>
				</text>
				<text
					x="100"
					y="92"
					textAnchor="middle"
					fontSize="42"
					fontFamily="Alfa Slab One, Cooper Black, Georgia, serif"
					fill="#1a1a1a"
				>
					60
				</text>
				<text
					x="100"
					y="118"
					textAnchor="middle"
					fontSize="18"
					fontFamily="Alfa Slab One, Cooper Black, Georgia, serif"
					fill="#1a1a1a"
					letterSpacing="2"
				>
					DAYS
				</text>
			</svg>
		</div>
	);
}
