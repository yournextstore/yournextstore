import Image from "next/image";
import { YnsLink } from "../yns-link";

function StarSticker({ className = "" }: { className?: string }) {
	return (
		<svg viewBox="0 0 64 64" className={className} aria-hidden="true">
			<title>star sticker</title>
			<path d="M32 2 L37 22 L57 22 L41 35 L47 56 L32 44 L17 56 L23 35 L7 22 L27 22 Z" fill="currentColor" />
		</svg>
	);
}

function NewBadge() {
	return (
		<div className="absolute top-6 right-6 z-20 w-20 h-20 sm:w-24 sm:h-24 animate-spin-slow">
			<svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
				<title>new badge</title>
				<defs>
					<path id="circle-text" d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" />
				</defs>
				<circle cx="50" cy="50" r="42" fill="#e8755b" />
				<circle cx="50" cy="50" r="32" fill="none" stroke="#fdf8f5" strokeWidth="0.8" strokeDasharray="2 2" />
				<text
					fill="#fdf8f5"
					fontSize="9.5"
					fontFamily="var(--font-fraunces), serif"
					fontStyle="italic"
					letterSpacing="1"
				>
					<textPath href="#circle-text">NEW · BOLD · FRESH · NEW · BOLD · FRESH ·</textPath>
				</text>
			</svg>
		</div>
	);
}

export function Hero() {
	return (
		<section className="px-3 sm:px-6 pt-6 sm:pt-10 pb-12 sm:pb-16">
			<div className="max-w-7xl mx-auto">
				<div className="grid grid-cols-12 gap-3 sm:gap-4">
					{/* Left: tilted can / hero collage with grid-paper background */}
					<div className="relative col-span-12 md:col-span-7 rounded-[28px] overflow-hidden bg-grid-paper min-h-[420px] sm:min-h-[560px]">
						<NewBadge />

						{/* Decorative star accents */}
						<StarSticker className="absolute left-10 bottom-32 w-6 h-6 text-[var(--coral)]/70 rotate-12" />
						<StarSticker className="absolute left-24 top-20 w-4 h-4 text-[var(--coral)]/60 -rotate-12" />
						<StarSticker className="absolute right-12 bottom-12 w-5 h-5 text-[var(--coral)]/70 rotate-45" />

						{/* Tilted can illustration */}
						<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
							<div className="relative w-[58%] sm:w-[52%] aspect-[1/1.85] animate-bravo-float">
								<div
									className="absolute inset-0 rounded-[44px] shadow-2xl"
									style={{
										background: "linear-gradient(140deg, #fde2d8 0%, #f5c9be 35%, #efa391 80%, #e8755b 100%)",
									}}
								>
									{/* Top cap */}
									<div
										className="absolute -top-2 inset-x-4 h-3 rounded-full"
										style={{ background: "linear-gradient(180deg, #c9a89c, #f5d3c8)" }}
									/>
									{/* Wordmark on can */}
									<div className="absolute inset-x-0 top-1/3 text-center">
										<p className="font-display italic text-[var(--coral)] text-3xl sm:text-5xl rotate-[-90deg] origin-center inline-block tracking-tight">
											YNS
										</p>
									</div>
									<div className="absolute left-1/2 -translate-x-1/2 bottom-10 w-10 h-10 rounded-full bg-[var(--cream)]/95 flex items-center justify-center">
										<StarSticker className="w-5 h-5 text-[var(--coral)]" />
									</div>
									{/* Bottom rim */}
									<div className="absolute -bottom-2 inset-x-6 h-2 rounded-full bg-[var(--coral-soft)]/70" />
								</div>
							</div>
						</div>
					</div>

					{/* Right column with two stacked panels */}
					<div className="col-span-12 md:col-span-5 grid grid-rows-2 gap-3 sm:gap-4 min-h-[420px] sm:min-h-[560px]">
						{/* Top-down can panel */}
						<div className="relative rounded-[28px] overflow-hidden bg-[var(--peach-light)]">
							<Image
								src="/scraped-1.jpg"
								alt="Refreshing top-down beverage shot"
								fill
								className="object-cover"
								sizes="(max-width: 768px) 100vw, 40vw"
								priority
							/>
							<div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[var(--peach)]/40" />
						</div>

						{/* Bravo Energy info card */}
						<div className="relative rounded-[28px] overflow-hidden bg-coral-gradient text-[var(--cream)] p-7 sm:p-9 flex flex-col justify-between">
							<div
								aria-hidden="true"
								className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-white/10 blur-2xl"
							/>
							<div
								aria-hidden="true"
								className="absolute inset-0 bg-halftone opacity-[0.07] mix-blend-overlay"
							/>
							<div className="relative">
								<p className="text-xs uppercase tracking-[0.24em] text-[var(--cream)]/80 mb-3">
									Just Launched
								</p>
								<h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight">
									Bold <em className="not-italic block">flavor.</em>
									<span className="italic">Pure spark.</span>
								</h1>
							</div>
							<div className="relative space-y-5">
								<p className="text-[15px] leading-relaxed text-[var(--cream)]/85 max-w-[28ch]">
									Unleash the power within. A small-batch sparkling lineup brewed with real fruit, zero
									regret.
								</p>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="inline-flex items-center gap-2 bg-[var(--cream)] text-[var(--ink)] hover:bg-white px-6 py-3 rounded-full text-sm font-semibold tracking-wide transition-all hover:scale-[1.02]"
								>
									Shop now
									<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
										<title>arrow</title>
										<path
											d="M5 12h14M13 5l7 7-7 7"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</YnsLink>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
