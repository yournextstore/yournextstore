import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative isolate overflow-hidden bg-[#0f0f10] text-[#fbf6ec]">
			{/* Background layered gradient + decorative SVG */}
			<div className="absolute inset-0 yns-hero-gradient" />
			<div
				aria-hidden="true"
				className="absolute inset-0 opacity-50 mix-blend-overlay"
				style={{
					backgroundImage: "url(/hero-bg-2.svg)",
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			/>
			<svg
				aria-hidden="true"
				className="absolute -bottom-24 -right-24 h-[640px] w-[640px] opacity-60 mix-blend-soft-light"
				viewBox="0 0 600 600"
				fill="none"
			>
				<title>Decorative bloom</title>
				<defs>
					<radialGradient id="bloom" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor="#f2b7c1" stopOpacity="0.95" />
						<stop offset="60%" stopColor="#e11226" stopOpacity="0.4" />
						<stop offset="100%" stopColor="#0f0f10" stopOpacity="0" />
					</radialGradient>
				</defs>
				<circle cx="300" cy="300" r="280" fill="url(#bloom)" />
			</svg>
			<svg
				aria-hidden="true"
				className="absolute -top-32 -left-32 h-[520px] w-[520px] opacity-40 mix-blend-screen"
				viewBox="0 0 600 600"
				fill="none"
			>
				<title>Decorative sunburst</title>
				<defs>
					<radialGradient id="sun" cx="50%" cy="50%" r="50%">
						<stop offset="0%" stopColor="#fbf6ec" stopOpacity="0.7" />
						<stop offset="100%" stopColor="#fbf6ec" stopOpacity="0" />
					</radialGradient>
				</defs>
				<circle cx="300" cy="300" r="280" fill="url(#sun)" />
			</svg>
			{/* Grain overlay */}
			<div aria-hidden="true" className="absolute inset-0 yns-grain opacity-40" />
			{/* Soft vignette */}
			<div
				aria-hidden="true"
				className="absolute inset-0 pointer-events-none"
				style={{
					background: "radial-gradient(ellipse at center, transparent 30%, rgba(15,15,16,0.55) 100%)",
				}}
			/>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="min-h-[78vh] md:min-h-[86vh] flex flex-col items-center justify-center text-center py-24 sm:py-32">
					<p className="text-[11px] sm:text-xs tracking-[0.5em] uppercase text-[#fbf6ec]/85 mb-6 sm:mb-8">
						An elevated soda experience
					</p>
					<h1 className="font-serif font-medium tracking-[-0.02em] text-[#fbf6ec] leading-[0.92] text-balance">
						<span className="block text-[64px] sm:text-[96px] lg:text-[140px]">Yes,</span>
						<span className="block text-[64px] sm:text-[96px] lg:text-[140px]">you&apos;re</span>
						<span className="block italic font-medium text-[#f2b7c1] text-[72px] sm:text-[112px] lg:text-[160px] mt-1">
							hot
						</span>
					</h1>
					<p className="mt-8 sm:mt-10 max-w-md text-sm sm:text-base text-[#fbf6ec]/85 leading-relaxed">
						Infused with aloe vera, made with all-natural ingredients and prebiotic fibers. Stay hot, stay
						hydrated.
					</p>
					<div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="inline-flex items-center justify-center h-12 px-10 bg-[#fbf6ec] text-[#0f0f10] rounded-full text-xs tracking-[0.28em] uppercase font-semibold hover:bg-[#f2b7c1] transition-colors"
						>
							Shop Now
						</YnsLink>
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="inline-flex items-center justify-center h-12 px-10 border border-[#fbf6ec]/80 text-[#fbf6ec] rounded-full text-xs tracking-[0.28em] uppercase font-semibold hover:bg-[#fbf6ec]/10 transition-colors"
						>
							Explore Merch
						</YnsLink>
					</div>
				</div>
			</div>

			{/* Bottom fade into cream */}
			<div
				aria-hidden="true"
				className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-b from-transparent to-[#fbf6ec]"
			/>
		</section>
	);
}
