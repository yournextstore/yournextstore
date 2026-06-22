import { YnsLink } from "../yns-link";

function HeroVisual() {
	return (
		<div className="relative w-full aspect-[5/4] sm:aspect-[4/3] lg:aspect-auto lg:h-full">
			<svg
				viewBox="0 0 600 540"
				className="absolute inset-0 w-full h-full"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
			>
				<defs>
					<radialGradient id="plateGrad" cx="35%" cy="38%" r="70%">
						<stop offset="0%" stopColor="#c66b3d" />
						<stop offset="55%" stopColor="#a64a23" />
						<stop offset="100%" stopColor="#6f2f12" />
					</radialGradient>
					<radialGradient id="plateInner" cx="40%" cy="40%" r="55%">
						<stop offset="0%" stopColor="#d77c4e" />
						<stop offset="100%" stopColor="#b8542c" />
					</radialGradient>
					<linearGradient id="jarGrad" x1="0" y1="0" x2="1" y2="1">
						<stop offset="0%" stopColor="#2b1c14" />
						<stop offset="100%" stopColor="#120a05" />
					</linearGradient>
					<linearGradient id="forkGrad" x1="0" y1="0" x2="1" y2="0">
						<stop offset="0%" stopColor="#cfc8be" />
						<stop offset="45%" stopColor="#f1ece4" />
						<stop offset="55%" stopColor="#f1ece4" />
						<stop offset="100%" stopColor="#9a948b" />
					</linearGradient>
					<filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
						<feGaussianBlur in="SourceAlpha" stdDeviation="14" />
						<feOffset dx="6" dy="14" result="off" />
						<feComponentTransfer>
							<feFuncA type="linear" slope="0.45" />
						</feComponentTransfer>
						<feMerge>
							<feMergeNode />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
				</defs>

				{/* Plate */}
				<g filter="url(#softShadow)">
					<ellipse cx="230" cy="290" rx="240" ry="234" fill="url(#plateGrad)" />
					<ellipse cx="225" cy="285" rx="190" ry="186" fill="url(#plateInner)" opacity="0.9" />
					<ellipse
						cx="225"
						cy="285"
						rx="190"
						ry="186"
						fill="none"
						stroke="#9c4220"
						strokeWidth="2"
						opacity="0.5"
					/>
				</g>

				{/* Single capsule pill on plate edge */}
				<g transform="translate(295 110) rotate(35)">
					<rect x="-12" y="-5" width="24" height="10" rx="5" fill="#f4eddf" />
					<rect x="-12" y="-5" width="12" height="10" fill="#e6d9bb" rx="5" />
				</g>

				{/* Supplement jar */}
				<g transform="translate(140 220)">
					<rect x="0" y="0" width="170" height="200" rx="14" fill="url(#jarGrad)" />
					<rect x="0" y="0" width="170" height="30" rx="14" fill="#0a0604" />
					<rect x="0" y="22" width="170" height="6" fill="#1a0e08" />
					{/* Label */}
					<g transform="translate(20 60)">
						<text
							x="0"
							y="22"
							fontFamily="'Pixelify Sans', monospace"
							fontSize="34"
							fontWeight="700"
							fill="#b8542c"
							letterSpacing="-1"
						>
							yournext
						</text>
						<text
							x="0"
							y="44"
							fontFamily="'Pixelify Sans', monospace"
							fontSize="16"
							fontWeight="700"
							fill="#c66b3d"
						>
							store
						</text>
						<text
							x="80"
							y="44"
							fontFamily="'Pixelify Sans', monospace"
							fontSize="11"
							fill="#8a8278"
							letterSpacing="2"
						>
							P24
						</text>
						<line x1="0" y1="58" x2="130" y2="58" stroke="#3a2418" strokeWidth="1" />
						<text x="0" y="76" fontFamily="Inter, sans-serif" fontSize="8" fill="#9a8a7a" letterSpacing="2">
							PROTEIN ENZYME
						</text>
						<text x="0" y="92" fontFamily="Inter, sans-serif" fontSize="9" fill="#c66b3d">
							absorbs protein
						</text>
						<text x="0" y="104" fontFamily="Inter, sans-serif" fontSize="9" fill="#c66b3d">
							up to 2× more
						</text>
						<text
							x="0"
							y="138"
							fontFamily="Inter, sans-serif"
							fontSize="7"
							fill="#7a6a5a"
							letterSpacing="1.5"
						>
							60 CAPSULES
						</text>
						<text
							x="80"
							y="138"
							fontFamily="Inter, sans-serif"
							fontSize="7"
							fill="#7a6a5a"
							letterSpacing="1.5"
						>
							DIETARY SUPPLEMENT
						</text>
					</g>
				</g>

				{/* Fork */}
				<g transform="translate(360 60) rotate(8)">
					<rect x="-8" y="0" width="16" height="280" rx="8" fill="url(#forkGrad)" />
					<path
						d="M-18 0 Q-18 -50 -14 -80 L-10 0 Z M-6 0 Q-6 -55 -2 -85 L2 0 Z M6 0 Q6 -55 10 -85 L14 0 Z M14 0 L18 -80 Q18 -50 18 0 Z"
						fill="url(#forkGrad)"
					/>
					<rect x="-9" y="280" width="18" height="180" rx="9" fill="url(#forkGrad)" />
				</g>

				{/* Knife */}
				<g transform="translate(430 50) rotate(6)">
					<path d="M-12 0 L12 0 L20 110 L-8 110 Z" fill="url(#forkGrad)" />
					<rect x="-9" y="110" width="18" height="350" rx="9" fill="url(#forkGrad)" />
				</g>

				{/* Subtle linen texture overlay (cross-hatch) */}
				<g opacity="0.08">
					<pattern id="linen" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
						<line x1="0" y1="0" x2="6" y2="6" stroke="#1a1612" strokeWidth="0.5" />
					</pattern>
					<rect width="600" height="540" fill="url(#linen)" />
				</g>
			</svg>
		</div>
	);
}

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-hero-terracotta text-cream">
			{/* Warm light from top-left */}
			<div
				aria-hidden="true"
				className="absolute inset-0 pointer-events-none opacity-60"
				style={{
					background: "radial-gradient(circle at 15% 20%, rgba(255,210,160,0.35), transparent 50%)",
				}}
			/>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[560px] lg:min-h-[640px]">
					{/* Left: product visual */}
					<div className="relative lg:absolute lg:inset-y-0 lg:left-0 lg:w-1/2 lg:pl-4 xl:pl-8 flex items-center">
						<HeroVisual />
					</div>

					{/* Right: headline */}
					<div className="lg:col-start-2 relative py-16 lg:py-24 max-w-xl lg:ml-auto text-center lg:text-right">
						<h1 className="font-display text-[40px] sm:text-[52px] lg:text-[64px] xl:text-[72px] leading-[1.05] text-cream tracking-tight text-balance">
							Fuel Your Muscles, Mind, and Metabolism with P24.
						</h1>
						<p className="mt-7 text-[15px] sm:text-base lg:text-lg leading-relaxed text-cream/85 max-w-md mx-auto lg:mx-0 lg:ml-auto">
							Your Next Store P24 is an enzyme that helps you digest and absorb all protein more efficiently,
							so you feel stronger, think clearer, and recover faster.
						</p>
						<div className="mt-10 flex justify-center lg:justify-end">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="group inline-flex items-center gap-4 bg-ink text-cream pl-7 pr-3 py-3.5 rounded-sm text-[11px] tracking-[0.22em] uppercase font-semibold hover:bg-black transition-colors"
							>
								Buy P24
								<span className="inline-block w-5 h-5 bg-terracotta rounded-[2px] group-hover:bg-terracotta-light transition-colors" />
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
