import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden">
			<div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr]">
				{/* Left: editorial close-up + headline overlay */}
				<div className="relative isolate min-h-[420px] sm:min-h-[520px] lg:min-h-[640px] bg-gradient-clay">
					<Image
						src="/scraped-2.jpg"
						alt="Close-up of glowing dewy skin"
						fill
						priority
						sizes="(max-width: 1024px) 100vw, 60vw"
						className="object-cover mix-blend-multiply opacity-90"
					/>
					{/* warm vignette */}
					<div
						aria-hidden="true"
						className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(61,46,38,0.45)_100%)]"
					/>
					<div className="absolute inset-0 flex flex-col justify-between p-8 sm:p-12 lg:p-16">
						<div className="font-serif text-sm tracking-[0.3em] uppercase text-cream/90">
							The Botanical Edit · Vol. 01
						</div>
						<div className="max-w-md">
							<h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[0.95] text-cream drop-shadow-sm">
								Moisturize
								<br />
								<span className="italic font-light">Nourish</span>
								<br />
								Protect
							</h1>
							<p className="mt-6 max-w-xs text-sm sm:text-base text-cream/85 leading-relaxed">
								Our products offer the perfect harmony for your skin — plant-led rituals, slow craftsmanship,
								quiet luxury.
							</p>
							<div className="mt-8 flex flex-wrap gap-3">
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="inline-flex items-center gap-2 h-11 px-6 bg-cream text-deep-brown rounded-full text-sm font-medium tracking-wide hover:bg-cream/90 transition-colors"
								>
									Shop the ritual
									<ArrowUpRightIcon className="h-4 w-4" />
								</YnsLink>
								<YnsLink
									prefetch={"eager"}
									href="#ingredients"
									className="inline-flex items-center gap-2 h-11 px-6 border border-cream/40 text-cream rounded-full text-sm font-medium hover:bg-cream/10 transition-colors"
								>
									Our ingredients
								</YnsLink>
							</div>
						</div>
					</div>
				</div>

				{/* Right: product showcase with botanical leaves */}
				<div className="relative isolate min-h-[420px] sm:min-h-[520px] lg:min-h-[640px] bg-sand overflow-hidden">
					{/* monstera-style golden leaves */}
					<svg
						aria-hidden="true"
						viewBox="0 0 400 600"
						className="absolute -right-10 top-0 h-full w-auto text-warm-tan/60"
						fill="currentColor"
					>
						<title>botanical accent</title>
						<path d="M200 50 C 260 80 290 160 280 240 C 270 320 230 380 200 440 C 170 380 130 320 120 240 C 110 160 140 80 200 50 Z" />
						<path
							d="M200 50 L 200 440"
							stroke="oklch(0.55 0.05 60)"
							strokeWidth="1.5"
							fill="none"
							opacity="0.4"
						/>
						<g opacity="0.6">
							<path
								d="M200 110 L 240 130 M200 110 L 160 130 M200 170 L 250 190 M200 170 L 150 190 M200 230 L 255 250 M200 230 L 145 250 M200 290 L 250 310 M200 290 L 150 310 M200 350 L 240 370 M200 350 L 160 370"
								stroke="oklch(0.55 0.05 60)"
								strokeWidth="1.2"
								fill="none"
							/>
						</g>
					</svg>
					<svg
						aria-hidden="true"
						viewBox="0 0 300 500"
						className="absolute -left-12 -bottom-10 h-3/4 w-auto text-clay/40 rotate-12"
						fill="currentColor"
					>
						<title>botanical accent</title>
						<path d="M150 30 C 200 70 220 150 210 220 C 200 290 170 340 150 400 C 130 340 100 290 90 220 C 80 150 100 70 150 30 Z" />
					</svg>

					{/* dropper bottles via inline SVG mockup */}
					<div className="absolute inset-0 flex items-center justify-center gap-6 px-8">
						<div className="relative">
							<div className="absolute -inset-6 rounded-full bg-warm-tan/30 blur-2xl" />
							<svg
								viewBox="0 0 160 320"
								className="relative h-72 sm:h-80 lg:h-96 w-auto drop-shadow-2xl"
								aria-label="Amber serum dropper bottle"
							>
								<title>amber serum bottle</title>
								<defs>
									<linearGradient id="amber" x1="0" y1="0" x2="1" y2="1">
										<stop offset="0%" stopColor="#D4A574" />
										<stop offset="50%" stopColor="#C28144" />
										<stop offset="100%" stopColor="#8B5A2B" />
									</linearGradient>
									<linearGradient id="amberHi" x1="0" y1="0" x2="1" y2="0">
										<stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
										<stop offset="40%" stopColor="rgba(255,255,255,0)" />
									</linearGradient>
								</defs>
								<rect x="55" y="20" width="50" height="44" rx="4" fill="#3D2E26" />
								<rect x="62" y="60" width="36" height="10" fill="#2A1F18" />
								<path
									d="M40 70 L 120 70 L 130 110 L 130 290 Q 130 310 110 310 L 50 310 Q 30 310 30 290 L 30 110 Z"
									fill="url(#amber)"
								/>
								<path d="M40 80 L 42 290" stroke="url(#amberHi)" strokeWidth="6" />
								<rect x="50" y="180" width="60" height="60" fill="#F5EFE8" opacity="0.92" />
								<text
									x="80"
									y="205"
									textAnchor="middle"
									fill="#3D2E26"
									fontFamily="serif"
									fontSize="9"
									letterSpacing="2"
								>
									YNS
								</text>
								<text
									x="80"
									y="220"
									textAnchor="middle"
									fill="#3D2E26"
									fontFamily="serif"
									fontSize="7"
									letterSpacing="1.5"
								>
									GLOW SERUM
								</text>
								<text x="80" y="232" textAnchor="middle" fill="#8B5A2B" fontSize="5" letterSpacing="1">
									30 ML / 1 FL OZ
								</text>
							</svg>
						</div>
						<div className="relative -mb-6">
							<div className="absolute -inset-6 rounded-full bg-cream/40 blur-2xl" />
							<svg
								viewBox="0 0 160 320"
								className="relative h-64 sm:h-72 lg:h-[22rem] w-auto drop-shadow-2xl"
								aria-label="Frosted serum dropper bottle"
							>
								<title>frosted serum bottle</title>
								<defs>
									<linearGradient id="frost" x1="0" y1="0" x2="0" y2="1">
										<stop offset="0%" stopColor="#F5EFE8" />
										<stop offset="100%" stopColor="#D9CDBC" />
									</linearGradient>
								</defs>
								<rect x="55" y="20" width="50" height="44" rx="4" fill="#3D2E26" />
								<rect x="62" y="60" width="36" height="10" fill="#2A1F18" />
								<path
									d="M40 70 L 120 70 L 130 110 L 130 290 Q 130 310 110 310 L 50 310 Q 30 310 30 290 L 30 110 Z"
									fill="url(#frost)"
									stroke="#B8997F"
									strokeWidth="0.5"
								/>
								<rect x="50" y="170" width="60" height="70" fill="none" stroke="#3D2E26" strokeWidth="0.4" />
								<text
									x="80"
									y="195"
									textAnchor="middle"
									fill="#3D2E26"
									fontFamily="serif"
									fontSize="10"
									letterSpacing="3"
								>
									YNS
								</text>
								<text x="80" y="212" textAnchor="middle" fill="#3D2E26" fontSize="6" letterSpacing="1.5">
									HYDRA ELIXIR
								</text>
								<text x="80" y="228" textAnchor="middle" fill="#8B7355" fontSize="5" letterSpacing="1">
									BOTANICAL · 50ML
								</text>
							</svg>
						</div>
					</div>

					{/* floating SHOP NOW pill */}
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full bg-foreground text-background text-[11px] font-medium tracking-[0.25em] uppercase shadow-2xl hover:bg-foreground/90 transition-colors"
					>
						<span className="inline-flex flex-col items-center gap-1">
							Shop
							<span className="h-px w-6 bg-background/40" />
							Now
						</span>
					</YnsLink>
				</div>
			</div>
		</section>
	);
}
