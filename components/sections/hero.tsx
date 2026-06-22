import { ArrowRightIcon, LeafIcon, ZapIcon } from "lucide-react";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
				<div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] min-h-[460px] sm:min-h-[560px] lg:min-h-[620px]">
					{/* Background landscape */}
					<div aria-hidden className="absolute inset-0">
						<svg
							viewBox="0 0 1440 720"
							preserveAspectRatio="xMidYMid slice"
							className="absolute inset-0 w-full h-full"
						>
							<defs>
								<linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stopColor="#dbe9ee" />
									<stop offset="55%" stopColor="#f3eed9" />
									<stop offset="100%" stopColor="#e7dcb7" />
								</linearGradient>
								<linearGradient id="mountFar" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stopColor="#9ab2a6" />
									<stop offset="100%" stopColor="#6b8a73" />
								</linearGradient>
								<linearGradient id="mountMid" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stopColor="#5c7748" />
									<stop offset="100%" stopColor="#3a5028" />
								</linearGradient>
								<linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stopColor="#3a4a23" />
									<stop offset="100%" stopColor="#1f2c12" />
								</linearGradient>
								<radialGradient id="sun" cx="50%" cy="50%" r="50%">
									<stop offset="0%" stopColor="#fff7d4" />
									<stop offset="60%" stopColor="#f5d77a" stopOpacity="0.6" />
									<stop offset="100%" stopColor="#f5d77a" stopOpacity="0" />
								</radialGradient>
							</defs>
							<rect width="1440" height="720" fill="url(#skyGrad)" />
							<circle cx="1080" cy="220" r="240" fill="url(#sun)" />
							<circle cx="1080" cy="220" r="60" fill="#fff5c8" opacity="0.85" />
							{/* far mountains */}
							<path
								d="M0 430 L160 360 L320 410 L500 320 L680 400 L860 340 L1040 410 L1220 360 L1440 420 L1440 720 L0 720 Z"
								fill="url(#mountFar)"
								opacity="0.85"
							/>
							{/* mid mountains */}
							<path
								d="M0 520 L120 460 L260 510 L420 430 L580 510 L760 460 L920 520 L1080 470 L1240 530 L1440 490 L1440 720 L0 720 Z"
								fill="url(#mountMid)"
							/>
							{/* foreground hill */}
							<path
								d="M0 600 C 240 540 420 640 720 580 C 1020 530 1240 640 1440 590 L1440 720 L0 720 Z"
								fill="url(#grass)"
							/>
							{/* solar panel rows on hill */}
							<g opacity="0.85">
								<rect
									x="180"
									y="600"
									width="120"
									height="40"
									fill="#1a2438"
									rx="2"
									transform="rotate(-6 240 620)"
								/>
								<rect
									x="340"
									y="610"
									width="120"
									height="40"
									fill="#1a2438"
									rx="2"
									transform="rotate(-4 400 630)"
								/>
								<rect
									x="520"
									y="615"
									width="120"
									height="40"
									fill="#1a2438"
									rx="2"
									transform="rotate(-2 580 635)"
								/>
							</g>
						</svg>
						<div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/10" />
					</div>

					{/* Top corner badges */}
					<div className="relative z-10 flex justify-end p-5 sm:p-7">
						<div className="hidden sm:flex items-center gap-3">
							<div className="flex items-center gap-2 rounded-full bg-white/85 backdrop-blur-md px-4 py-2 shadow-sm">
								<span className="flex size-7 items-center justify-center rounded-full bg-[var(--lime-soft)] text-[var(--forest-deep)]">
									<ZapIcon className="size-3.5" />
								</span>
								<div className="leading-tight">
									<div className="text-[15px] font-bold text-[var(--forest-deep)]">20%</div>
									<div className="text-[10px] text-[var(--forest-deep)]/70 uppercase tracking-wider">
										Higher Yield
									</div>
								</div>
							</div>
							<div className="flex items-center gap-2 rounded-full bg-white/85 backdrop-blur-md px-4 py-2 shadow-sm">
								<span className="flex size-7 items-center justify-center rounded-full bg-[var(--lime-soft)] text-[var(--forest-deep)]">
									<LeafIcon className="size-3.5" />
								</span>
								<div className="leading-tight">
									<div className="text-[15px] font-bold text-[var(--forest-deep)]">25 yr</div>
									<div className="text-[10px] text-[var(--forest-deep)]/70 uppercase tracking-wider">
										Warranty
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Hero text */}
					<div className="relative z-10 px-6 sm:px-12 lg:px-16 pt-6 pb-12 sm:pb-16 lg:pb-20">
						<div className="max-w-3xl">
							<div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--forest-deep)]">
								<span className="size-1.5 rounded-full bg-[var(--lime)]" />
								Tier-1 Modules · Made for Rooftops
							</div>
							<h1 className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-white text-balance drop-shadow-sm">
								Harness the
								<br />
								<span className="italic font-medium">Power of the Sun</span>
							</h1>
							<p className="mt-5 max-w-xl text-base sm:text-lg text-white/90 leading-relaxed">
								Premium solar panels, inverters and complete kits — designed for homeowners who want clean
								energy without the guesswork.
							</p>
							<div className="mt-8 flex flex-wrap items-center gap-3">
								<YnsLink
									prefetch={"eager"}
									href="#products"
									className="inline-flex items-center gap-2 h-12 px-7 bg-[var(--lime)] text-[var(--forest-deep)] rounded-full text-sm font-semibold hover:brightness-95 transition shadow-lg shadow-black/10"
								>
									Shop Solar Kits
									<ArrowRightIcon className="h-4 w-4" />
								</YnsLink>
								<YnsLink
									prefetch={"eager"}
									href="#about"
									className="inline-flex items-center gap-2 h-12 px-6 bg-white/15 backdrop-blur border border-white/30 text-white rounded-full text-sm font-medium hover:bg-white/25 transition"
								>
									How It Works
								</YnsLink>
							</div>

							{/* Trust strip */}
							<div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-white/85">
								<span className="flex items-center gap-2">
									<span className="size-1.5 rounded-full bg-[var(--lime)]" /> 12,400+ rooftops powered
								</span>
								<span className="flex items-center gap-2">
									<span className="size-1.5 rounded-full bg-[var(--lime)]" /> NABCEP certified installers
								</span>
								<span className="flex items-center gap-2">
									<span className="size-1.5 rounded-full bg-[var(--lime)]" /> 0% APR financing
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
