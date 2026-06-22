import Image from "next/image";
import { YnsLink } from "../yns-link";

const TICKER_PHRASES = [
	"FROM TABLETOP TO TRAIL.",
	"BUILT FOR EVERY HORIZON.",
	"PACK LIGHT. PLAY ANYWHERE.",
	"CRAFTED IN SMALL BATCHES.",
];

function Marquee() {
	const sequence = [...TICKER_PHRASES, ...TICKER_PHRASES, ...TICKER_PHRASES, ...TICKER_PHRASES];
	return (
		<div className="relative bg-[color:var(--color-yns-cream)] border-y border-[color:var(--color-yns-ink)]/15 overflow-hidden">
			<div className="flex whitespace-nowrap yns-marquee py-3 text-[11px] sm:text-[13px] tracking-utility font-semibold text-[color:var(--color-yns-ink)]">
				{sequence.map((phrase, i) => (
					<span
						key={`${phrase}-${i}`}
						className="px-8 inline-flex items-center gap-8 shrink-0 after:content-[''] after:inline-block after:w-1.5 after:h-1.5 after:rounded-full after:bg-[color:var(--color-yns-wood)]"
					>
						{phrase}
					</span>
				))}
			</div>
		</div>
	);
}

export function Hero() {
	return (
		<section className="relative">
			{/* Full-bleed hero */}
			<div className="relative w-full overflow-hidden bg-[color:var(--color-yns-wood)]">
				<div className="relative aspect-[16/10] sm:aspect-[16/8] lg:aspect-[1440/720] w-full">
					<Image
						src="/scraped-0.jpg"
						alt="Travel backgammon case on weathered oak"
						fill
						priority
						sizes="100vw"
						className="object-cover"
					/>
					{/* Subtle vignette to bed in the type */}
					<div
						aria-hidden="true"
						className="absolute inset-0 bg-gradient-to-b from-[color:var(--color-yns-ink)]/10 via-transparent to-[color:var(--color-yns-ink)]/30 pointer-events-none"
					/>

					{/* Tagline (top center) */}
					<div className="absolute top-6 sm:top-10 lg:top-16 inset-x-0 z-10 flex justify-center px-4">
						<h1 className="font-display text-center text-[color:var(--color-yns-cream)] font-black uppercase leading-[0.92] tracking-[-0.01em] text-lg sm:text-2xl lg:text-[34px] max-w-3xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
							Your Next Store: The Travel Goods
							<br className="hidden sm:block" /> Built For Every Horizon
						</h1>
					</div>

					{/* Massive knockout wordmark */}
					<div
						aria-hidden="true"
						className="absolute inset-x-0 bottom-[8%] sm:bottom-[10%] z-10 flex justify-center px-2 sm:px-4"
					>
						<svg
							viewBox="0 0 1400 280"
							className="w-full max-w-[1380px] h-auto"
							preserveAspectRatio="xMidYMid meet"
						>
							<title>Your Next Store</title>
							<text
								x="50%"
								y="55%"
								dominantBaseline="middle"
								textAnchor="middle"
								className="font-display"
								style={{
									fontFamily: "var(--font-display)",
									fontWeight: 900,
									fontStretch: "125%",
									fontSize: "260px",
									letterSpacing: "-0.04em",
									fill: "#a8b8cc",
									paintOrder: "stroke",
								}}
							>
								YOUR NEXT STORE
							</text>
						</svg>
					</div>

					{/* Top corners label/cart hint */}
					<div className="absolute top-3 left-4 sm:left-6 lg:left-10 z-10 text-[10px] sm:text-xs tracking-utility font-semibold text-[color:var(--color-yns-cream)]/90">
						EST. 2024
					</div>
					<div className="absolute top-3 right-4 sm:right-6 lg:right-10 z-10 text-[10px] sm:text-xs tracking-utility font-semibold text-[color:var(--color-yns-cream)]/90">
						COLLECTION №01
					</div>

					{/* CTAs centered, just above the ticker */}
					<div className="absolute inset-x-0 bottom-6 sm:bottom-10 z-20 flex justify-center px-4">
						<div className="flex flex-col sm:flex-row gap-3 items-center">
							<YnsLink
								prefetch={"eager"}
								href="#products"
								className="inline-flex items-center justify-center h-11 px-7 bg-[color:var(--color-yns-cream)] text-[color:var(--color-yns-ink)] text-[11px] tracking-utility font-bold rounded-none border border-[color:var(--color-yns-cream)] hover:bg-[color:var(--color-yns-dust)] hover:border-[color:var(--color-yns-dust)] transition-colors"
							>
								SHOP THE COLLECTION
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="#about"
								className="inline-flex items-center justify-center h-11 px-7 bg-transparent text-[color:var(--color-yns-cream)] text-[11px] tracking-utility font-bold rounded-none border border-[color:var(--color-yns-cream)]/70 hover:bg-[color:var(--color-yns-cream)] hover:text-[color:var(--color-yns-ink)] transition-colors"
							>
								OUR STORY
							</YnsLink>
						</div>
					</div>
				</div>
			</div>

			<Marquee />
		</section>
	);
}
