import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden">
			<div className="relative hero-mahogany">
				<div className="absolute inset-0 grain-overlay opacity-60 pointer-events-none" />
				{/* Decorative ceramic silhouettes (inline SVG, crisp at any size) */}
				<svg
					aria-hidden="true"
					className="absolute -left-20 top-10 w-[420px] opacity-25 mix-blend-screen text-[#e8dfd2] hidden md:block"
					viewBox="0 0 400 400"
					fill="currentColor"
				>
					<title>plate</title>
					<circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="1.5" />
					<circle cx="200" cy="200" r="155" fill="none" stroke="currentColor" strokeWidth="1" />
					<circle cx="200" cy="200" r="120" fill="none" stroke="currentColor" strokeWidth="0.8" />
					<circle cx="200" cy="200" r="80" fill="none" stroke="currentColor" strokeWidth="0.6" />
				</svg>
				<svg
					aria-hidden="true"
					className="absolute -right-24 bottom-0 w-[480px] opacity-20 mix-blend-screen text-[#e8dfd2] hidden md:block"
					viewBox="0 0 500 500"
					fill="none"
					stroke="currentColor"
				>
					<title>bowl</title>
					<ellipse cx="250" cy="260" rx="220" ry="80" strokeWidth="1.2" />
					<ellipse cx="250" cy="240" rx="200" ry="65" strokeWidth="0.8" />
					<path d="M 30 260 Q 250 420 470 260" strokeWidth="1.2" />
				</svg>
				{/* faint vignette */}
				<div
					aria-hidden="true"
					className="absolute inset-0 pointer-events-none"
					style={{
						background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.45) 100%)",
					}}
				/>

				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="min-h-[560px] sm:min-h-[640px] lg:min-h-[720px] flex flex-col items-center justify-center text-center py-24">
						<span className="text-[11px] tracking-[0.32em] uppercase text-[#e8dfd2]/70 mb-6">
							Studio Collection · 2026
						</span>
						<h1 className="font-display text-5xl sm:text-7xl lg:text-8xl tracking-tight text-[#f5efe6] max-w-4xl leading-[1.02]">
							Products for <em className="italic font-light">the</em> Soul
						</h1>
						<p className="mt-6 max-w-xl text-base sm:text-lg text-[#e8dfd2]/75 leading-relaxed font-light italic">
							Breathing new life into cultural craft — handmade ceramics, candles, and objects shaped slowly,
							in small batches.
						</p>
						<div className="mt-10 flex flex-col sm:flex-row gap-4">
							<YnsLink
								prefetch={"eager"}
								href="#products"
								className="inline-flex items-center justify-center h-12 px-10 bg-[#f5efe6] text-[#2b2522] rounded-full text-[12px] font-medium tracking-[0.22em] uppercase hover:bg-white transition-colors"
							>
								Shop Now
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="#about"
								className="inline-flex items-center justify-center h-12 px-10 border border-[#e8dfd2]/40 rounded-full text-[12px] font-medium tracking-[0.22em] uppercase text-[#f5efe6] hover:bg-[#f5efe6]/10 transition-colors"
							>
								Our Story
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
