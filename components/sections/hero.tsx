import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-studio">
			{/* Soft window-light raking shadow */}
			<div
				aria-hidden="true"
				className="absolute inset-0 pointer-events-none opacity-60"
				style={{
					background:
						"linear-gradient(115deg, oklch(1 0 0 / 0.5) 0%, transparent 40%, transparent 70%, oklch(0.86 0.025 70 / 0.35) 100%)",
				}}
			/>
			<div aria-hidden="true" className="absolute inset-0 pointer-events-none bg-noise opacity-40" />

			<div className="relative max-w-[1400px] mx-auto px-6 lg:px-10">
				{/* Top label */}
				<div className="pt-12 pb-4 text-center font-grotesk text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">
					<span className="text-accent/80">(</span> the <span className="text-accent/80">)</span>
				</div>

				{/* Editorial stage */}
				<div className="relative min-h-[60vh] md:min-h-[78vh] grid grid-cols-12 gap-4 items-center">
					{/* Left meta column */}
					<div className="relative z-20 col-span-12 md:col-span-3 self-end md:self-center order-2 md:order-1 mb-8 md:mb-0">
						<div className="font-editorial text-sm italic text-muted-foreground/80 leading-snug max-w-[14rem]">
							70 years of the…
						</div>
						<p className="mt-3 font-grotesk text-xs leading-relaxed text-muted-foreground max-w-[16rem]">
							Celebrating the anniversary of the world&apos;s most quietly iconic chair — a fluid plywood
							shell drawn in 1955 and still drawn today.
						</p>
						<div className="mt-6 flex items-center gap-2 font-grotesk text-[10px] uppercase tracking-eyebrow text-foreground">
							<span aria-hidden className="block h-px w-6 bg-foreground" />
							edition №07
						</div>
					</div>

					{/* Center: layered serif wordmark + chair */}
					<div className="relative col-span-12 md:col-span-6 order-1 md:order-2 flex items-center justify-center">
						{/* Serif italic backdrop word "Series" left + "Seven" right */}
						<div
							aria-hidden="true"
							className="absolute inset-0 flex items-center justify-between pointer-events-none select-none"
						>
							<span className="font-editorial italic font-light text-[clamp(4rem,14vw,12rem)] leading-none -translate-x-[10%] md:-translate-x-[18%] text-foreground/90">
								Series
							</span>
							<span className="font-editorial italic font-light text-[clamp(4rem,14vw,12rem)] leading-none translate-x-[10%] md:translate-x-[18%] text-foreground/90">
								Seven
							</span>
						</div>

						{/* Chair / hero subject — SVG silhouette */}
						<div className="relative z-10 w-[58%] sm:w-[52%] md:w-[58%] aspect-[3/4]">
							<SeriesSevenChair />
						</div>

						{/* Floor shadow */}
						<div
							aria-hidden="true"
							className="absolute bottom-[6%] left-1/2 -translate-x-1/2 h-6 w-[58%] md:w-[40%] rounded-[50%] bg-walnut/20 blur-2xl"
							style={{
								background:
									"radial-gradient(ellipse at center, oklch(0.46 0.085 50 / 0.35), transparent 70%)",
							}}
						/>
					</div>

					{/* Right meta column */}
					<div className="relative z-20 col-span-12 md:col-span-3 self-start md:self-center order-3 md:text-right mb-8 md:mb-0">
						<div className="space-y-1 font-grotesk text-xs uppercase tracking-eyebrow text-muted-foreground">
							<div>iconic shape</div>
							<div className="text-foreground">danish design</div>
						</div>
						<p className="mt-4 font-grotesk text-xs leading-relaxed text-muted-foreground max-w-[16rem] md:ml-auto">
							A curated menu of seating, tables and quiet objects — assembled with reverence for the makers
							who set the brief.
						</p>
						<div className="mt-6 flex md:justify-end gap-3">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex items-center justify-center h-9 px-5 rounded-full bg-foreground text-background font-grotesk text-[11px] uppercase tracking-eyebrow hover:bg-walnut transition-colors"
							>
								Shop
							</YnsLink>
						</div>
					</div>
				</div>

				{/* Bottom (7) label and floating product tile */}
				<div className="relative flex items-end justify-between pb-12 pt-6">
					<div className="font-grotesk text-[10px] uppercase tracking-eyebrow text-muted-foreground/70">
						<span className="text-accent/80">(</span> 7 <span className="text-accent/80">)</span>
					</div>

					{/* Floating product tile */}
					<div className="hidden sm:flex items-stretch overflow-hidden rounded-md border border-border/70 bg-card shadow-[0_20px_50px_-30px_oklch(0.18_0.005_60/0.4)]">
						<div className="relative w-24 h-24 bg-accent/90">
							<div className="absolute inset-0 flex items-center justify-center">
								<MiniChair className="w-12 h-12 text-background" />
							</div>
						</div>
						<div className="flex flex-col justify-between p-3 w-44">
							<div>
								<div className="font-grotesk text-[9px] uppercase tracking-eyebrow text-muted-foreground">
									new
								</div>
								<div className="font-editorial italic text-sm text-foreground leading-tight mt-0.5">
									The Chair — Caramel
								</div>
							</div>
							<div className="font-grotesk text-[10px] uppercase tracking-eyebrow text-muted-foreground">
								from $980
							</div>
						</div>
					</div>
				</div>

				{/* Scattered bracket ornaments */}
				<div
					aria-hidden="true"
					className="absolute top-[18%] left-[7%] font-editorial italic text-3xl text-accent/40 select-none"
				>
					[
				</div>
				<div
					aria-hidden="true"
					className="absolute top-[18%] right-[7%] font-editorial italic text-3xl text-accent/40 select-none"
				>
					]
				</div>
				<div
					aria-hidden="true"
					className="absolute bottom-[22%] left-[14%] font-editorial italic text-2xl text-foreground/30 select-none rotate-12"
				>
					{"{ }"}
				</div>
			</div>
		</section>
	);
}

function SeriesSevenChair({ className = "" }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 240 320"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={`w-full h-full drop-shadow-[0_30px_30px_oklch(0.46_0.085_50/0.25)] ${className}`}
			aria-hidden="true"
		>
			<defs>
				<linearGradient id="seatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stopColor="oklch(0.82 0.08 70)" />
					<stop offset="45%" stopColor="oklch(0.7 0.105 55)" />
					<stop offset="100%" stopColor="oklch(0.48 0.08 50)" />
				</linearGradient>
				<linearGradient id="seatRim" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" stopColor="oklch(0.55 0.09 50)" />
					<stop offset="100%" stopColor="oklch(0.38 0.07 50)" />
				</linearGradient>
				<linearGradient id="legGrad" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" stopColor="oklch(0.92 0.005 70)" />
					<stop offset="50%" stopColor="oklch(0.75 0.005 70)" />
					<stop offset="100%" stopColor="oklch(0.55 0.005 70)" />
				</linearGradient>
				<radialGradient id="seatHighlight" cx="35%" cy="20%" r="60%">
					<stop offset="0%" stopColor="oklch(0.96 0.04 80 / 0.7)" />
					<stop offset="100%" stopColor="oklch(0.96 0.04 80 / 0)" />
				</radialGradient>
			</defs>

			{/* Backrest (top fluid shell) */}
			<path
				d="M55 50 C 55 18, 185 18, 185 50 L 175 130 C 170 145, 70 145, 65 130 Z"
				fill="url(#seatGrad)"
				stroke="url(#seatRim)"
				strokeWidth="1.5"
			/>
			<path
				d="M55 50 C 55 18, 185 18, 185 50 L 175 130 C 170 145, 70 145, 65 130 Z"
				fill="url(#seatHighlight)"
			/>
			<circle cx="120" cy="92" r="3" fill="oklch(0.32 0.04 50)" />

			{/* Waist of the chair */}
			<path
				d="M75 130 C 100 160, 140 160, 165 130 L 175 175 C 165 188, 75 188, 65 175 Z"
				fill="url(#seatGrad)"
				stroke="url(#seatRim)"
				strokeWidth="1.2"
			/>

			{/* Seat (lower shell) */}
			<ellipse
				cx="120"
				cy="200"
				rx="92"
				ry="22"
				fill="url(#seatGrad)"
				stroke="url(#seatRim)"
				strokeWidth="1.5"
			/>
			<ellipse cx="120" cy="196" rx="92" ry="18" fill="url(#seatHighlight)" opacity="0.7" />

			{/* Chrome legs */}
			<line
				x1="55"
				y1="208"
				x2="20"
				y2="312"
				stroke="url(#legGrad)"
				strokeWidth="3.5"
				strokeLinecap="round"
			/>
			<line
				x1="100"
				y1="218"
				x2="90"
				y2="312"
				stroke="url(#legGrad)"
				strokeWidth="3.5"
				strokeLinecap="round"
			/>
			<line
				x1="140"
				y1="218"
				x2="150"
				y2="312"
				stroke="url(#legGrad)"
				strokeWidth="3.5"
				strokeLinecap="round"
			/>
			<line
				x1="185"
				y1="208"
				x2="220"
				y2="312"
				stroke="url(#legGrad)"
				strokeWidth="3.5"
				strokeLinecap="round"
			/>

			{/* Cross brace */}
			<path d="M30 285 C 80 290, 160 290, 210 285" stroke="url(#legGrad)" strokeWidth="2" fill="none" />
		</svg>
	);
}

function MiniChair({ className = "" }: { className?: string }) {
	return (
		<svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
			<path d="M14 8 C 14 5, 34 5, 34 8 L 32 26 C 31 28, 17 28, 16 26 Z" fill="currentColor" opacity="0.85" />
			<ellipse cx="24" cy="32" rx="14" ry="3" fill="currentColor" opacity="0.85" />
			<line x1="13" y1="33" x2="9" y2="44" stroke="currentColor" strokeWidth="1" />
			<line x1="20" y1="34" x2="18" y2="44" stroke="currentColor" strokeWidth="1" />
			<line x1="28" y1="34" x2="30" y2="44" stroke="currentColor" strokeWidth="1" />
			<line x1="35" y1="33" x2="39" y2="44" stroke="currentColor" strokeWidth="1" />
		</svg>
	);
}
