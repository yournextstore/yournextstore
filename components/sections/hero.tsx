import Image from "next/image";
import { YnsLink } from "../yns-link";

const FLAVORS = [
	{
		name: "Berry Blend",
		tint: "from-[#2438b8] via-[#1f2fa3] to-[#0f1758]",
		labelColor: "text-bone",
		offset: "translate-y-6 -rotate-[4deg]",
	},
	{
		name: "Cool Citrus",
		tint: "from-[#f5f3ee] via-[#e6e2d8] to-[#a8a59c]",
		labelColor: "text-[#1f2fa3]",
		offset: "z-10",
	},
	{
		name: "Lemon Lime",
		tint: "from-[#c7d6b5] via-[#a8bd91] to-[#5d6f49]",
		labelColor: "text-[#2c3a18]",
		offset: "translate-y-6 rotate-[4deg]",
	},
] as const;

function Can({
	name,
	tint,
	labelColor,
	offset,
}: {
	name: string;
	tint: string;
	labelColor: string;
	offset: string;
}) {
	return (
		<div className={`can-hover relative ${offset}`}>
			<div
				className={`relative w-[180px] sm:w-[210px] lg:w-[240px] h-[360px] sm:h-[420px] lg:h-[480px] rounded-[28px] bg-gradient-to-b ${tint} shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] overflow-hidden`}
			>
				{/* Highlight gloss */}
				<div className="pointer-events-none absolute inset-y-3 left-3 w-[10px] rounded-full bg-white/30 blur-[2px]" />
				<div className="pointer-events-none absolute inset-y-6 right-4 w-[6px] rounded-full bg-white/20 blur-[3px]" />
				{/* Top rim */}
				<div className="absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-black/40 to-transparent" />
				<div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-black/40 to-transparent" />
				{/* Flavor label */}
				<div className="absolute inset-x-0 top-12 text-center">
					<span
						className={`font-sans text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase ${labelColor}`}
					>
						{name}
					</span>
				</div>
				{/* Wordmark */}
				<div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
					<div
						className={`font-display font-black leading-none tracking-tight ${labelColor} text-[64px] sm:text-[76px] lg:text-[88px]`}
						style={{
							textShadow: "0 2px 8px rgba(0,0,0,0.18)",
							fontStretch: "expanded",
						}}
					>
						Y<span className="opacity-60">.</span>N<span className="opacity-60">.</span>S
					</div>
					<div className={`mt-3 font-display italic text-base sm:text-lg ${labelColor}/90`}>
						<div className="leading-tight">Quality</div>
						<div className="leading-tight -mt-1">Hydration</div>
					</div>
				</div>
			</div>
			{/* Floor reflection */}
			<div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[70%] h-6 rounded-full bg-black/60 blur-xl" />
		</div>
	);
}

export function Hero() {
	return (
		<section className="relative granite overflow-hidden">
			{/* Decorative SVG hero backdrop layer */}
			<div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen">
				<Image src="/hero-bg-1.svg" alt="" fill priority sizes="100vw" className="object-cover" />
			</div>
			{/* Glow accents */}
			<div className="pointer-events-none absolute top-1/3 left-[10%] w-[440px] h-[440px] rounded-full bg-[#2438b8]/20 blur-[140px]" />
			<div className="pointer-events-none absolute bottom-0 right-[5%] w-[520px] h-[520px] rounded-full bg-[#d9cde6]/15 blur-[160px]" />

			<div className="relative max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pt-16 sm:pt-24 lg:pt-28 pb-0">
				{/* Heading */}
				<div className="text-center max-w-5xl mx-auto">
					<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/5 text-[10px] tracking-[0.3em] uppercase text-foreground/80 mb-8">
						<span className="inline-block w-1.5 h-1.5 rounded-full bg-lilac animate-pulse" />
						New · Performance Series
					</div>
					<h1 className="font-display font-light leading-[0.92] tracking-[-0.02em] text-bone text-[64px] sm:text-[110px] lg:text-[160px]">
						<span className="italic">Quality</span> <span className="font-medium">Hydration</span>
						<span className="font-sans align-top text-2xl sm:text-4xl lg:text-5xl ml-2 text-foreground/60">
							™
						</span>
					</h1>
					<p className="mt-6 sm:mt-8 text-base sm:text-lg lg:text-xl text-foreground/70 font-light max-w-xl mx-auto">
						A sports drink designed to replace what you sweat.
					</p>
					<div className="mt-10 flex flex-wrap items-center justify-center gap-3">
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="inline-flex items-center justify-center h-11 px-9 bg-lilac text-[#1a1a1e] rounded-sm text-[11px] font-semibold tracking-[0.3em] uppercase hover:bg-bone transition-colors"
						>
							Shop Now
						</YnsLink>
						<YnsLink
							prefetch={"eager"}
							href="#science"
							className="inline-flex items-center justify-center h-11 px-9 border border-white/20 text-bone rounded-sm text-[11px] font-semibold tracking-[0.3em] uppercase hover:bg-white/5 transition-colors"
						>
							The Science
						</YnsLink>
					</div>
				</div>

				{/* Floating cans */}
				<div className="relative mt-16 sm:mt-20 lg:mt-12">
					<div className="flex items-end justify-center gap-2 sm:gap-4 lg:gap-6 -mb-24 sm:-mb-32">
						{FLAVORS.map((flavor) => (
							<Can key={flavor.name} {...flavor} />
						))}
					</div>
				</div>
			</div>

			{/* Spacer for cans overlap */}
			<div className="h-24 sm:h-32" />
		</section>
	);
}
