import Image from "next/image";

export function FlavorFeature() {
	return (
		<section className="px-3 sm:px-6 pb-12 sm:pb-16">
			<div className="max-w-7xl mx-auto">
				<div className="relative rounded-[32px] overflow-hidden bg-[var(--peach)] py-16 sm:py-24 px-6 sm:px-12">
					{/* Halftone dots top-right */}
					<div
						aria-hidden="true"
						className="absolute top-6 right-6 sm:top-10 sm:right-12 w-32 sm:w-48 h-24 sm:h-32 bg-halftone-ink opacity-30 rounded-full"
					/>
					{/* Halftone dots bottom-left */}
					<div
						aria-hidden="true"
						className="absolute bottom-8 left-8 sm:bottom-12 sm:left-16 w-24 sm:w-36 h-16 sm:h-24 bg-halftone-ink opacity-20 rounded-full"
					/>

					{/* Lightning bolts */}
					<svg
						aria-hidden="true"
						className="absolute top-10 left-10 w-7 h-7 text-[var(--coral)] -rotate-12"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						<title>bolt</title>
						<path d="M13 0 L3 14 L11 14 L9 24 L21 8 L13 8 Z" />
					</svg>
					<svg
						aria-hidden="true"
						className="absolute bottom-12 right-1/4 w-6 h-6 text-[var(--coral)] rotate-12"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						<title>bolt</title>
						<path d="M13 0 L3 14 L11 14 L9 24 L21 8 L13 8 Z" />
					</svg>

					<div className="relative text-center">
						<h2 className="font-display text-[clamp(2.75rem,8vw,6rem)] tracking-tighter text-[var(--ink)] leading-[0.9]">
							Flavor and <em className="italic">Success</em>
						</h2>
						<h2 className="font-display text-[clamp(2.75rem,8vw,6rem)] tracking-tighter text-[var(--ink)] leading-[0.9] mt-1 sm:mt-2 relative inline-block">
							in Every <em className="italic">Can</em>
							{/* Stamp-style overlay */}
							<span className="absolute -right-6 sm:-right-16 top-1/3 -rotate-12 inline-flex items-center justify-center rounded-full border-2 border-[var(--coral)] bg-[var(--coral)]/10 px-4 py-1.5 backdrop-blur-sm">
								<span className="font-display italic text-[var(--coral)] text-xl sm:text-2xl">limited</span>
							</span>
						</h2>

						<p className="mt-8 sm:mt-12 mx-auto max-w-xl text-[15px] sm:text-base leading-relaxed text-[var(--ink)]/65">
							A toast to the doers, the dreamers, the just-one-more-thing-ers. Every can is brewed for the
							spark you bring to the day.
						</p>
					</div>
				</div>

				{/* Sea Breeze product highlight strip */}
				<div className="mt-3 sm:mt-4 rounded-[32px] overflow-hidden bg-[var(--cream)] border border-[var(--peach)]/60 px-6 sm:px-10 py-7 sm:py-9 flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
					<div className="relative w-32 h-32 sm:w-40 sm:h-40 shrink-0 rounded-2xl bg-[var(--sky-soft)] overflow-hidden">
						<Image
							src="/scraped-3.jpg"
							alt="Sea Breeze flavor highlight"
							fill
							className="object-contain p-3"
							sizes="160px"
						/>
					</div>
					<div className="flex-1 text-center sm:text-left">
						<p className="text-xs uppercase tracking-[0.24em] text-[var(--coral)] font-semibold">
							New flavor
						</p>
						<h3 className="font-display text-3xl sm:text-4xl italic text-[var(--ink)] mt-1">Sea Breeze</h3>
						<p className="mt-1.5 text-sm text-[var(--ink)]/60 max-w-md">
							Salted citrus, fizzy coconut, a hint of mint. Tastes like a Tuesday off.
						</p>
					</div>
					<a
						href="/products"
						className="bg-[var(--ink)] hover:bg-[var(--ink)]/90 text-[var(--cream)] px-6 py-3 rounded-full text-sm font-semibold tracking-wide transition-colors"
					>
						Shop
					</a>
				</div>
			</div>
		</section>
	);
}
