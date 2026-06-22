export function WordmarkChain() {
	return (
		<section className="relative overflow-hidden bg-foreground border-b-2 border-foreground">
			{/* Bleeding oversized wordmark */}
			<div
				aria-hidden="true"
				className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
			>
				<span className="font-display text-[24vw] sm:text-[20vw] leading-[0.85] tracking-tighter text-background/5 whitespace-nowrap">
					your·next·store
				</span>
			</div>

			{/* Chain SVG decoration */}
			<svg
				aria-hidden="true"
				viewBox="0 0 1400 400"
				className="absolute inset-0 w-full h-full opacity-90"
				preserveAspectRatio="xMidYMid slice"
			>
				<title>Chain decoration</title>
				<defs>
					<linearGradient id="chrome" x1="0" x2="1" y1="0" y2="1">
						<stop offset="0%" stopColor="#f5f5f5" />
						<stop offset="50%" stopColor="#7a7a7a" />
						<stop offset="100%" stopColor="#262626" />
					</linearGradient>
				</defs>
				{Array.from({ length: 9 }).map((_, i) => {
					const x = 50 + i * 160;
					const r = i % 2 === 0 ? -28 : 28;
					const y = i % 2 === 0 ? 180 : 220;
					return (
						<g key={`chain-${i}`} transform={`translate(${x} ${y}) rotate(${r})`}>
							<ellipse cx="0" cy="0" rx="58" ry="30" fill="none" stroke="url(#chrome)" strokeWidth="18" />
						</g>
					);
				})}
			</svg>

			{/* Side tickers */}
			<div className="absolute top-0 right-0 h-full w-9 sm:w-12 bg-[#d4ff3a] border-l-2 border-foreground overflow-hidden hidden md:block">
				<div className="h-full flex items-center justify-center">
					<span className="font-display text-xs uppercase tracking-[0.35em] whitespace-nowrap -rotate-90">
						E-Commerce · Next Generation · Your Next Store · E-Commerce · Next Generation
					</span>
				</div>
			</div>
			<div className="absolute top-0 left-0 h-full w-9 sm:w-12 bg-[#d4ff3a] border-r-2 border-foreground overflow-hidden hidden md:block">
				<div className="h-full flex items-center justify-center">
					<span className="font-display text-xs uppercase tracking-[0.35em] whitespace-nowrap rotate-90">
						YNS · Brutalist Streetwear · Drops Weekly · YNS · Brutalist Streetwear
					</span>
				</div>
			</div>

			<div className="relative z-10 py-20 sm:py-28 lg:py-36 px-4">
				<div className="max-w-3xl mx-auto text-center">
					<div className="inline-flex items-center gap-2 bg-[#d4ff3a] text-foreground px-3 py-1.5 text-[10px] font-bold tracking-[0.25em] uppercase border-2 border-[#d4ff3a]">
						<span className="h-1.5 w-1.5 rounded-full bg-foreground" />
						Live · 2026 Drop
					</div>
					<h2 className="mt-6 font-display uppercase text-3xl sm:text-4xl lg:text-5xl leading-[0.95] text-background">
						Brutalism meets bubblegum.
						<br />
						<span className="text-[#d4ff3a]">Built for the next generation of shopping.</span>
					</h2>
				</div>
			</div>
		</section>
	);
}
