import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-background border-b-2 border-foreground/10">
			<div className="grid grid-cols-1 lg:grid-cols-2 min-h-[60vh] lg:min-h-[640px]">
				{/* Left: copy */}
				<div className="relative flex items-center px-6 sm:px-12 lg:pl-20 py-16 lg:py-24">
					<div className="max-w-xl">
						<p className="mb-5 text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[var(--color-leaf-deep)]">
							<span className="inline-block w-8 h-px bg-[var(--color-leaf-deep)] align-middle mr-3" />
							New batch dropped this week
						</p>
						<h1 className="display text-5xl sm:text-6xl lg:text-7xl xl:text-[88px] leading-[0.92] uppercase headline-outline">
							Your gut
							<br />
							friendly
							<br />
							best friend
						</h1>
						<p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-sm leading-relaxed">
							Your Next Store&rsquo;s A2 dairy lattes &mdash; happy tummy, happier mornings.
						</p>
						<div className="mt-9 flex flex-wrap items-center gap-4">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex items-center justify-center h-12 px-8 bg-[var(--color-espresso)] text-[var(--color-cream)] rounded-full text-sm font-bold uppercase tracking-[0.2em] hover:bg-[var(--color-espresso-deep)] transition-all hover:scale-[1.03]"
							>
								Shop now
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="#story"
								className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-foreground hover:text-[var(--color-leaf-deep)] transition-colors group"
							>
								Our Story
								<span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">
									→
								</span>
							</YnsLink>
						</div>

						{/* Sticker accents */}
						<div className="hidden sm:flex items-center gap-3 mt-12 text-[10px] font-bold uppercase tracking-widest">
							<span className="sticker inline-flex items-center justify-center bg-[var(--color-cobalt)] text-white rounded-full px-3 py-1 -rotate-6">
								A2 Dairy
							</span>
							<span className="sticker inline-flex items-center justify-center bg-[var(--color-pink)] text-white rounded-full px-3 py-1 rotate-3">
								Gut Friendly
							</span>
							<span className="sticker inline-flex items-center justify-center bg-[var(--color-butter)] text-foreground rounded-full px-3 py-1 -rotate-2">
								Cold Brewed
							</span>
						</div>
					</div>

					{/* Decorative cow doodle */}
					<svg
						aria-hidden
						className="absolute bottom-6 right-6 w-16 h-16 text-foreground/15 hidden lg:block"
						viewBox="0 0 64 64"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
					>
						<title>cow</title>
						<ellipse cx="32" cy="38" rx="20" ry="14" />
						<circle cx="25" cy="36" r="2.5" fill="currentColor" />
						<circle cx="39" cy="36" r="2.5" fill="currentColor" />
						<ellipse cx="32" cy="44" rx="6" ry="3.5" />
						<ellipse cx="14" cy="24" rx="5" ry="8" transform="rotate(-25 14 24)" />
						<ellipse cx="50" cy="24" rx="5" ry="8" transform="rotate(25 50 24)" />
					</svg>
				</div>

				{/* Right: product photo edge-bleed */}
				<div className="relative h-[60vh] lg:h-auto min-h-[420px] bg-[var(--color-butter-soft)] overflow-hidden">
					<Image
						src="/scraped-0.jpg"
						alt="Stacked A2 lattes — happy tummy coffee"
						fill
						priority
						sizes="(max-width: 1024px) 100vw, 50vw"
						className="object-cover"
					/>
					<div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-background/30 lg:to-background/0" />
					{/* Floating sticker */}
					<div className="absolute top-8 right-8 sticker">
						<div className="bg-[var(--color-pink)] text-white rounded-full w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center -rotate-12 text-center">
							<div>
								<div className="display text-lg leading-none">NEW</div>
								<div className="text-[10px] font-bold uppercase tracking-widest mt-1">Dirty Chai</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Marquee ticker bottom */}
			<div className="border-t-2 border-foreground/10 bg-[var(--color-butter)]">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 overflow-hidden">
					<div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-foreground gap-6 whitespace-nowrap">
						<span className="ticker-divider hidden sm:inline">A2 Dairy</span>
						<span className="ticker-divider">Gut Friendly</span>
						<span className="ticker-divider">Real Espresso</span>
						<span className="hidden md:inline ticker-divider">No Seed Oils</span>
						<span className="hidden lg:inline">Made in California</span>
					</div>
				</div>
			</div>
		</section>
	);
}
