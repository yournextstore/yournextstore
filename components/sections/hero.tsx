import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative isolate overflow-hidden">
			<div className="hero-linen relative min-h-[640px] md:min-h-[720px] lg:min-h-[760px]">
				{/* Decorative ceramic plate, top-left */}
				<div
					aria-hidden
					className="pointer-events-none absolute -left-32 -bottom-24 w-[520px] h-[520px] rounded-full bg-[color:var(--cream)]/95 shadow-[inset_0_-30px_60px_rgba(126,42,31,0.15),0_30px_80px_rgba(0,0,0,0.35)] hidden md:block"
				>
					<div className="absolute inset-6 rounded-full border border-[color:var(--ink)]/5" />
					<div className="absolute inset-10 rounded-full border border-[color:var(--ink)]/5" />
					<div className="absolute inset-14 rounded-full border border-[color:var(--ink)]/5" />
				</div>

				{/* Brass spoon */}
				<div aria-hidden className="pointer-events-none absolute left-[18%] bottom-[14%] hidden md:block">
					<svg width="240" height="60" viewBox="0 0 240 60" fill="none">
						<defs>
							<linearGradient id="brass" x1="0" y1="0" x2="1" y2="1">
								<stop offset="0%" stopColor="#e8c98a" />
								<stop offset="55%" stopColor="#b8862f" />
								<stop offset="100%" stopColor="#7a5618" />
							</linearGradient>
						</defs>
						<ellipse cx="36" cy="30" rx="32" ry="22" fill="url(#brass)" />
						<rect x="60" y="26" width="172" height="8" rx="4" fill="url(#brass)" />
					</svg>
				</div>

				{/* Pampas grass — top right */}
				<div
					aria-hidden
					className="pointer-events-none absolute -right-16 top-0 w-[440px] h-[420px] opacity-90 hidden md:block"
				>
					<svg viewBox="0 0 440 420" fill="none" className="w-full h-full">
						<g stroke="#e8d9c4" strokeWidth="1.5" strokeLinecap="round" opacity="0.85">
							{Array.from({ length: 22 }).map((_, i) => (
								<path
									key={`pampas-${i}`}
									d={`M${340 - i * 4} ${20 + i * 5} Q ${300 - i * 3} ${120 + i * 6} ${200 - i * 6} ${260 + i * 4}`}
									opacity={0.75 - i * 0.02}
								/>
							))}
						</g>
						<g fill="#f3e6d2" opacity="0.8">
							{Array.from({ length: 90 }).map((_, i) => {
								const angle = (i / 90) * Math.PI * 0.4 + 0.6;
								const r = 120 + (i % 4) * 30;
								const cx = 340 - Math.cos(angle) * r;
								const cy = 30 + Math.sin(angle) * r;
								return (
									<ellipse
										key={`fluff-${i}`}
										cx={cx}
										cy={cy}
										rx="14"
										ry="4"
										transform={`rotate(${(angle * 180) / Math.PI - 90} ${cx} ${cy})`}
									/>
								);
							})}
						</g>
					</svg>
				</div>

				{/* Melted candle pool */}
				<div aria-hidden className="pointer-events-none absolute right-[14%] bottom-[18%] hidden md:block">
					<svg width="180" height="120" viewBox="0 0 180 120" fill="none">
						<path
							d="M30,60 Q20,30 50,22 Q90,8 130,20 Q170,30 158,68 Q150,100 110,108 Q60,114 38,98 Q14,80 30,60 Z"
							fill="#f5e7d2"
							opacity="0.95"
						/>
						<path
							d="M40,58 Q34,38 58,30 Q92,18 126,28 Q160,38 150,66 Q142,92 108,100 Q66,106 46,92 Q26,76 40,58 Z"
							fill="#fdf3df"
						/>
						<circle cx="92" cy="56" r="2.5" fill="#1a0e08" />
					</svg>
				</div>

				{/* Content overlay */}
				<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center min-h-[640px] md:min-h-[720px] lg:min-h-[760px]">
					<span className="eyebrow text-cream/70 mb-6">— Spring Atelier 2026 —</span>
					<h1 className="font-serif text-cream font-medium tracking-tight text-[44px] leading-[1.02] sm:text-6xl md:text-7xl lg:text-[88px] max-w-4xl">
						Products <span className="italic font-light">for the</span> Soul
					</h1>
					<p className="mt-7 max-w-md text-cream/80 text-base sm:text-lg leading-relaxed">
						Breathing new life into cultural craft — heirloom ceramics, brass and linen, gathered slowly.
					</p>
					<YnsLink
						prefetch={"eager"}
						href="#favorites"
						className="mt-10 inline-flex h-12 items-center justify-center rounded-full border border-cream/70 px-9 text-[12px] tracking-[0.24em] uppercase text-cream backdrop-blur-sm hover:bg-cream hover:text-[color:var(--oxblood)] transition-all"
					>
						Shop Now
					</YnsLink>
					<div className="mt-12 flex items-center gap-2 text-cream/60 text-[11px] tracking-[0.3em] uppercase">
						<span className="h-px w-8 bg-cream/40" />
						<span>Made by hand · since 2019</span>
						<span className="h-px w-8 bg-cream/40" />
					</div>
				</div>
			</div>

			{/* Soft fade into next section */}
			<div className="h-12 bg-gradient-to-b from-transparent to-background" aria-hidden />
		</section>
	);
}
