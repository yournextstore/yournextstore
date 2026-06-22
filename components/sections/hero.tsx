import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden yns-hero-bg">
			{/* faint grain for paper feel */}
			<div aria-hidden="true" className="absolute inset-0 yns-grain opacity-60 mix-blend-multiply" />

			{/* hairline divider on right */}
			<div
				aria-hidden="true"
				className="absolute right-0 top-0 bottom-0 hidden md:block w-px bg-foreground/[0.06]"
			/>

			<div className="relative grid lg:grid-cols-12 min-h-[640px] lg:min-h-[720px]">
				{/* LEFT: oversized neon pouch */}
				<div className="lg:col-span-5 relative flex items-center justify-center lg:justify-start overflow-hidden">
					<NeonPouchHero />
				</div>

				{/* RIGHT: floating product trio */}
				<div className="lg:col-span-7 relative flex items-center justify-center">
					<FloatingTrio />
				</div>

				{/* OVERLAY headline — bottom-left like the reference */}
				<div className="absolute left-6 sm:left-10 lg:left-14 bottom-10 sm:bottom-14 max-w-xl z-10">
					<h1 className="uppercase-display text-foreground text-[36px] sm:text-[54px] lg:text-[68px] leading-[0.95] font-medium tracking-[-0.01em]">
						Hydrate
						<br />
						<span className="inline-flex items-baseline gap-3">
							<span>&amp;</span>
							<span>Defend</span>
						</span>
					</h1>
					<p className="mt-4 max-w-sm uppercase-display text-[10.5px] sm:text-xs tracking-[0.22em] text-foreground/70">
						Receive a mini hydrate &amp; defend kit on orders $70+
					</p>
					<div className="mt-7">
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="inline-flex h-11 items-center justify-center px-7 bg-foreground text-background uppercase-display text-[11px] tracking-[0.22em] hover:bg-foreground/90 transition-colors"
						>
							Shop Now
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}

function NeonPouchHero() {
	return (
		<div className="relative w-[120%] sm:w-[105%] lg:w-[115%] aspect-square -ml-[8%] lg:-ml-[12%]">
			<svg
				viewBox="0 0 600 600"
				className="absolute inset-0 w-full h-full yns-float-shadow"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
			>
				<title>YNS hydrate kit</title>
				<defs>
					<linearGradient id="neon-face" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" stopColor="#E5FF55" stopOpacity="0.95" />
						<stop offset="55%" stopColor="#C8E536" stopOpacity="0.92" />
						<stop offset="100%" stopColor="#8FA51A" stopOpacity="0.85" />
					</linearGradient>
					<linearGradient id="neon-edge" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#F0FF7C" />
						<stop offset="100%" stopColor="#9CB322" />
					</linearGradient>
					<radialGradient id="neon-spot" cx="35%" cy="30%" r="45%">
						<stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
						<stop offset="100%" stopColor="#E5FF55" stopOpacity="0" />
					</radialGradient>
					<filter id="soft-blur">
						<feGaussianBlur stdDeviation="0.8" />
					</filter>
				</defs>

				{/* cast shadow */}
				<ellipse cx="320" cy="540" rx="240" ry="22" fill="#000" opacity="0.18" />

				{/* pouch — rotated rounded rect */}
				<g transform="translate(60 90) rotate(-8 240 220)">
					{/* back depth */}
					<rect x="22" y="22" width="440" height="380" rx="22" fill="#94B214" opacity="0.55" />
					{/* main face */}
					<rect x="0" y="0" width="440" height="380" rx="22" fill="url(#neon-face)" />
					{/* glossy spot */}
					<rect
						x="0"
						y="0"
						width="440"
						height="380"
						rx="22"
						fill="url(#neon-spot)"
						style={{ mixBlendMode: "screen" }}
					/>
					{/* edge highlight */}
					<rect
						x="0"
						y="0"
						width="440"
						height="380"
						rx="22"
						fill="none"
						stroke="url(#neon-edge)"
						strokeWidth="2"
					/>

					{/* zipper */}
					<rect x="14" y="14" width="412" height="14" rx="6" fill="#C8E536" />
					<rect x="20" y="18" width="400" height="2" fill="#FFFFFF" opacity="0.4" />
					{Array.from({ length: 40 }, (_, i) => (
						<rect
							key={`tooth-${i}`}
							x={26 + i * 10}
							y="16"
							width="4"
							height="10"
							rx="1"
							fill="#7E9018"
							opacity="0.55"
						/>
					))}

					{/* zipper tab */}
					<g transform="translate(394 30)">
						<rect x="0" y="0" width="6" height="22" rx="2" fill="#5B6B10" />
						<rect x="-6" y="20" width="18" height="14" rx="3" fill="#7E9018" />
						<circle cx="3" cy="27" r="3" fill="#3F4A0A" />
					</g>

					{/* big stencil-style brand on bag */}
					<g transform="translate(40 80)">
						<text
							x="0"
							y="80"
							fontFamily="Space Grotesk, sans-serif"
							fontSize="88"
							fontWeight="700"
							fill="#0D0D0D"
							letterSpacing="2"
						>
							YOUR
						</text>
						<text
							x="0"
							y="170"
							fontFamily="Space Grotesk, sans-serif"
							fontSize="88"
							fontWeight="700"
							fill="#0D0D0D"
							letterSpacing="2"
						>
							NEXT
						</text>
						<text
							x="0"
							y="260"
							fontFamily="Space Grotesk, sans-serif"
							fontSize="88"
							fontWeight="700"
							fill="#0D0D0D"
							letterSpacing="2"
						>
							STORE
						</text>
					</g>

					{/* subtle crinkles */}
					<path
						d="M30 320 Q 200 280 410 340"
						stroke="#A7BF2B"
						strokeWidth="1.4"
						fill="none"
						opacity="0.45"
						filter="url(#soft-blur)"
					/>
					<path
						d="M40 350 Q 220 320 420 365"
						stroke="#A7BF2B"
						strokeWidth="1"
						fill="none"
						opacity="0.35"
						filter="url(#soft-blur)"
					/>
				</g>

				{/* color spill on backdrop */}
				<ellipse cx="120" cy="320" rx="220" ry="120" fill="#D6F23A" opacity="0.18" filter="url(#soft-blur)" />
			</svg>
		</div>
	);
}

function FloatingTrio() {
	return (
		<div className="relative w-full h-full">
			<svg
				viewBox="0 0 800 600"
				className="absolute inset-0 w-full h-full"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
				preserveAspectRatio="xMidYMid meet"
			>
				<title>YNS product trio</title>
				<defs>
					<linearGradient id="tube-cream" x1="0%" y1="0%" x2="100%" y2="0%">
						<stop offset="0%" stopColor="#EFE3CC" />
						<stop offset="50%" stopColor="#F8F0DD" />
						<stop offset="100%" stopColor="#D9C8AA" />
					</linearGradient>
					<linearGradient id="tube-blush" x1="0%" y1="0%" x2="100%" y2="0%">
						<stop offset="0%" stopColor="#E3C2C8" />
						<stop offset="50%" stopColor="#F2D7DC" />
						<stop offset="100%" stopColor="#C9A4AB" />
					</linearGradient>
					<linearGradient id="bottle-amber" x1="0%" y1="0%" x2="100%" y2="0%">
						<stop offset="0%" stopColor="#2A1A0E" />
						<stop offset="50%" stopColor="#5A381E" />
						<stop offset="100%" stopColor="#2A1A0E" />
					</linearGradient>
					<radialGradient id="bottle-shine" cx="35%" cy="35%" r="40%">
						<stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.32" />
						<stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
					</radialGradient>
				</defs>

				{/* tube 1 — cream, tilted */}
				<g transform="translate(140 80) rotate(28 60 200)">
					<ellipse cx="60" cy="412" rx="80" ry="10" fill="#000" opacity="0.18" />
					<rect x="22" y="380" width="76" height="28" rx="4" fill="#0D0D0D" />
					<rect x="20" y="60" width="80" height="324" rx="14" fill="url(#tube-cream)" />
					<rect x="20" y="60" width="80" height="60" rx="14" fill="#FFFFFF" opacity="0.25" />
					<path d="M22 60 L60 30 L98 60 Z" fill="#D9C8AA" />
					<text
						x="60"
						y="200"
						textAnchor="middle"
						fontFamily="Space Grotesk, sans-serif"
						fontSize="9"
						fontWeight="600"
						fill="#0D0D0D"
						letterSpacing="2"
					>
						YNS·01
					</text>
					<text
						x="60"
						y="220"
						textAnchor="middle"
						fontFamily="Space Grotesk, sans-serif"
						fontSize="7"
						fill="#3a2f1c"
						letterSpacing="1"
					>
						MATTE BALM
					</text>
				</g>

				{/* amber bottle — center, lower */}
				<g transform="translate(360 200)">
					<ellipse cx="80" cy="290" rx="105" ry="14" fill="#000" opacity="0.28" />
					{/* cap */}
					<rect x="48" y="0" width="64" height="30" rx="4" fill="#0D0D0D" />
					<rect x="50" y="3" width="60" height="6" rx="2" fill="#2a2a2a" />
					{/* neck */}
					<rect x="62" y="28" width="36" height="14" fill="#3a2210" />
					{/* body — broad shoulders */}
					<path
						d="M30 60 Q 30 42 60 42 L100 42 Q 130 42 130 60 L130 250 Q 130 280 100 280 L60 280 Q 30 280 30 250 Z"
						fill="url(#bottle-amber)"
					/>
					<path
						d="M30 60 Q 30 42 60 42 L100 42 Q 130 42 130 60 L130 250 Q 130 280 100 280 L60 280 Q 30 280 30 250 Z"
						fill="url(#bottle-shine)"
					/>
					{/* label */}
					<rect x="38" y="105" width="84" height="120" fill="#1a1409" opacity="0.45" />
					<text
						x="80"
						y="142"
						textAnchor="middle"
						fontFamily="Space Grotesk, sans-serif"
						fontSize="10"
						fontWeight="600"
						fill="#F4E9DA"
						letterSpacing="2"
					>
						YOUR NEXT
					</text>
					<text
						x="80"
						y="158"
						textAnchor="middle"
						fontFamily="Space Grotesk, sans-serif"
						fontSize="10"
						fontWeight="600"
						fill="#F4E9DA"
						letterSpacing="2"
					>
						STORE
					</text>
					<line x1="46" y1="170" x2="114" y2="170" stroke="#F4E9DA" strokeWidth="0.4" opacity="0.6" />
					<text
						x="80"
						y="188"
						textAnchor="middle"
						fontFamily="Space Grotesk, sans-serif"
						fontSize="6"
						fill="#F4E9DA"
						letterSpacing="1.5"
					>
						GENTLE GEL FACIAL CLEANSE
					</text>
					<text
						x="80"
						y="202"
						textAnchor="middle"
						fontFamily="Space Grotesk, sans-serif"
						fontSize="5.5"
						fill="#C4B69D"
						letterSpacing="1"
					>
						GEL DOUX DEMAQUILLANT
					</text>
					<text
						x="80"
						y="214"
						textAnchor="middle"
						fontFamily="Space Grotesk, sans-serif"
						fontSize="5"
						fill="#C4B69D"
						letterSpacing="1"
					>
						100ML / 3.38 FL OZ
					</text>
				</g>

				{/* tube 2 — blush, tilted opposite */}
				<g transform="translate(580 50) rotate(-22 60 200)">
					<ellipse cx="60" cy="412" rx="80" ry="10" fill="#000" opacity="0.18" />
					<rect x="22" y="380" width="76" height="28" rx="4" fill="#0D0D0D" />
					<rect x="20" y="60" width="80" height="324" rx="14" fill="url(#tube-blush)" />
					<rect x="20" y="60" width="80" height="60" rx="14" fill="#FFFFFF" opacity="0.22" />
					<path d="M22 60 L60 30 L98 60 Z" fill="#C9A4AB" />
					<text
						x="60"
						y="200"
						textAnchor="middle"
						fontFamily="Space Grotesk, sans-serif"
						fontSize="9"
						fontWeight="600"
						fill="#0D0D0D"
						letterSpacing="2"
					>
						YNS·03
					</text>
					<text
						x="60"
						y="220"
						textAnchor="middle"
						fontFamily="Space Grotesk, sans-serif"
						fontSize="7"
						fill="#54353c"
						letterSpacing="1"
					>
						ROSE BARRIER
					</text>
				</g>
			</svg>
		</div>
	);
}
