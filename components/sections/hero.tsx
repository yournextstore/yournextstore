import { YnsLink } from "../yns-link";

function BrushColumn({ seed }: { seed: number }) {
	const strokes = Array.from({ length: 14 }, (_, i) => {
		const x = (seed * 7 + i * 73) % 100;
		const width = 1.4 + ((seed + i * 11) % 7) * 0.35;
		const top = ((seed * 3 + i * 29) % 24) - 6;
		const bottom = ((seed * 5 + i * 41) % 28) - 6;
		const opacity = 0.78 + (((seed + i) * 13) % 22) / 100;
		const skew = (((seed + i) * 17) % 6) - 3;
		return { x, width, top, bottom, opacity, skew, i };
	});

	return (
		<div className="absolute inset-0 overflow-hidden">
			{/* Warm putty backdrop with directional light */}
			<div
				aria-hidden
				className="absolute inset-0"
				style={{
					backgroundImage:
						seed % 2 === 0
							? "linear-gradient(135deg, #d3ccbf 0%, #c0b8a8 45%, #b6ad9d 100%)"
							: "linear-gradient(225deg, #c9c2b6 0%, #b3aa9b 50%, #a39a8b 100%)",
				}}
			/>
			<div
				aria-hidden
				className="absolute inset-0"
				style={{
					backgroundImage:
						"radial-gradient(ellipse at 30% 20%, rgba(255,250,240,0.55) 0%, rgba(255,250,240,0) 55%)",
					mixBlendMode: "screen",
				}}
			/>
			{/* Suggested silhouette — soft gradient figure */}
			<div
				aria-hidden
				className="absolute inset-x-0 bottom-0 top-[8%]"
				style={{
					backgroundImage:
						"radial-gradient(ellipse 42% 55% at 50% 60%, rgba(180,170,156,0.55) 0%, rgba(180,170,156,0) 70%)",
				}}
			/>
			{/* Painterly vertical brush strokes — the signature print */}
			<svg
				aria-hidden
				className="absolute inset-0 w-full h-full"
				preserveAspectRatio="none"
				viewBox="0 0 100 100"
			>
				<defs>
					<filter id={`brush-${seed}`} x="-10%" y="-10%" width="120%" height="120%">
						<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={seed} />
						<feDisplacementMap in="SourceGraphic" scale="0.6" />
					</filter>
					<linearGradient id={`fade-${seed}`} x1="0" x2="0" y1="0" y2="1">
						<stop offset="0%" stopColor="#161412" stopOpacity="0.85" />
						<stop offset="48%" stopColor="#161412" stopOpacity="1" />
						<stop offset="100%" stopColor="#161412" stopOpacity="0.7" />
					</linearGradient>
				</defs>
				<g filter={`url(#brush-${seed})`}>
					{strokes.map((s) => (
						<rect
							key={s.i}
							x={s.x}
							y={s.top}
							width={s.width}
							height={100 - s.top + s.bottom}
							fill={`url(#fade-${seed})`}
							opacity={s.opacity}
							transform={`skewX(${s.skew})`}
						/>
					))}
				</g>
			</svg>
			{/* Subtle film grain */}
			<div
				aria-hidden
				className="absolute inset-0 opacity-[0.18] mix-blend-overlay"
				style={{
					backgroundImage:
						"radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.4) 1px, transparent 1px)",
					backgroundSize: "3px 3px, 5px 5px",
					backgroundPosition: "0 0, 1px 1px",
				}}
			/>
		</div>
	);
}

export function Hero() {
	return (
		<section className="relative w-full">
			{/* Split editorial diptych */}
			<div className="relative grid grid-cols-2 h-[78vh] min-h-[560px] max-h-[820px]">
				<div className="relative">
					<BrushColumn seed={3} />
				</div>
				<div className="relative">
					<BrushColumn seed={8} />
				</div>

				{/* Soft seam between panels */}
				<div
					aria-hidden
					className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-black/15 to-transparent"
				/>

				{/* Centered overlay copy */}
				<div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
					<div className="max-w-2xl">
						<p className="font-eyebrow text-[10px] text-white/80 mb-5">— Capsule 003 —</p>
						<h1 className="font-serif font-light text-white text-2xl sm:text-3xl md:text-[34px] leading-snug tracking-tight">
							Elevated wardrobe icons, sustainably crafted using natural and organic fibres.
						</h1>
						<div className="mt-9 flex flex-col sm:flex-row gap-3 items-center justify-center">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="group relative inline-flex items-center justify-center h-11 px-9 text-[11px] font-eyebrow text-white border border-white/80 hover:bg-white hover:text-[#161412] transition-colors duration-300"
							>
								Explore Collection 003
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="#sustainability"
								className="font-eyebrow text-[11px] text-white/85 hover:text-white editorial-underline transition-colors"
							>
								Our Ethos
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
