import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative w-full overflow-hidden bg-[var(--cream)]">
			<div className="relative grid grid-cols-1 md:grid-cols-2 min-h-[78vh] md:min-h-[88vh]">
				{/* LEFT PANEL — monochrome */}
				<div className="relative overflow-hidden bg-hero-grad-mono noise-overlay">
					<Image
						src="/scraped-1.jpg"
						alt=""
						fill
						priority
						sizes="(max-width: 768px) 100vw, 50vw"
						className="object-cover mix-blend-luminosity opacity-90"
					/>
					<div className="absolute inset-0 bg-gradient-to-br from-black/15 via-transparent to-black/30" />

					{/* Vertical Danish Design Award badge */}
					<div className="absolute top-6 left-4 sm:top-10 sm:left-8 z-10">
						<div className="relative w-[88px] h-[88px] sm:w-[112px] sm:h-[112px] rounded-full border border-white/70 flex items-center justify-center text-white">
							<svg
								viewBox="0 0 100 100"
								className="absolute inset-0 w-full h-full animate-[spin_25s_linear_infinite]"
							>
								<defs>
									<path id="hero-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
								</defs>
								<text fill="white" fontSize="8.5" letterSpacing="1.5" fontFamily="var(--font-sans)">
									<textPath href="#hero-circle">DANISH · DESIGN · AWARD · DANISH · DESIGN · AWARD ·</textPath>
								</text>
							</svg>
							<span className="font-display text-[11px] sm:text-[13px] leading-none text-center tracking-wide">
								WINNER
								<br />
								<span className="text-[10px] tracking-[0.2em] opacity-90">2024</span>
							</span>
						</div>
					</div>

					{/* Vertical side rail */}
					<div className="absolute left-3 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-8 text-[10px] tracking-[0.32em] text-white/80">
						<span className="text-vertical">Instagram</span>
						<span className="h-12 w-px bg-white/40" />
						<span className="text-vertical">Newsletter</span>
					</div>
				</div>

				{/* RIGHT PANEL — warm */}
				<div className="relative overflow-hidden bg-hero-grad-warm noise-overlay">
					<Image
						src="/scraped-2.jpg"
						alt=""
						fill
						priority
						sizes="(max-width: 768px) 100vw, 50vw"
						className="object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-bl from-transparent via-transparent to-black/20" />
				</div>

				{/* Centered overlaid headline */}
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
					<div className="text-center px-6 pointer-events-auto">
						<p className="text-[10px] sm:text-xs tracking-[0.4em] text-white/85 uppercase mb-5 drop-shadow-md">
							New collection · Spring 2026
						</p>
						<h1 className="font-display text-white drop-shadow-2xl text-5xl sm:text-6xl md:text-7xl lg:text-[88px] leading-[0.95]">
							Born to connect
						</h1>
						<p className="mt-5 text-white/90 text-sm sm:text-base tracking-[0.18em] uppercase drop-shadow-md">
							A new era of nurturing
						</p>
						<div className="mt-9">
							<YnsLink prefetch={"eager"} href="/products" className="btn-olive">
								Buy now
							</YnsLink>
						</div>
					</div>
				</div>

				{/* Vertical divider */}
				<div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/15" />
			</div>
		</section>
	);
}
