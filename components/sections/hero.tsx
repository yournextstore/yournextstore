import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
			<div className="border border-foreground/15 rounded-[2px] overflow-hidden grid grid-cols-1 md:grid-cols-[1.35fr_1fr]">
				{/* Left panel — copy */}
				<div className="relative bg-white px-8 sm:px-12 lg:px-16 py-16 sm:py-20 lg:py-28 flex flex-col justify-center min-h-[440px] lg:min-h-[520px]">
					<span className="inline-flex items-center gap-2 self-start text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-6">
						<span aria-hidden="true" className="h-px w-6 bg-foreground/40" />
						Snacks · Made Better
					</span>
					<h1 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-medium tracking-tight text-foreground leading-[1.05] max-w-[19ch]">
						Better-for-you snacks that taste better, too.
					</h1>
					<p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-md leading-relaxed">
						Real ingredients, baked into crisp, lightly sweet bites packed with protein. Made for slow
						mornings, busy afternoons, and the moments in between.
					</p>
					<div className="mt-10 flex flex-wrap items-center gap-4">
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="inline-flex items-center justify-center h-11 px-7 bg-foreground text-background text-sm font-medium tracking-wide hover:bg-foreground/90 transition-colors"
						>
							Shop all
						</YnsLink>
						<YnsLink
							prefetch={"eager"}
							href="#about"
							className="inline-flex items-center justify-center text-sm font-medium text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-all"
						>
							Our story →
						</YnsLink>
					</div>

					{/* Soft decorative ornament */}
					<div
						aria-hidden="true"
						className="absolute left-8 sm:left-12 lg:left-16 bottom-8 flex items-center gap-6 text-[10px] uppercase tracking-[0.25em] text-muted-foreground"
					>
						<span className="flex items-center gap-2">
							<span className="h-1.5 w-1.5 rounded-full bg-[var(--crimson)]" /> Bakery Fresh
						</span>
						<span className="flex items-center gap-2">
							<span className="h-1.5 w-1.5 rounded-full bg-[var(--cobalt)]" /> 20g Protein
						</span>
						<span className="hidden sm:flex items-center gap-2">
							<span className="h-1.5 w-1.5 rounded-full bg-[var(--butter)]" /> 7 Ingredients
						</span>
					</div>
				</div>

				{/* Right panel — product spotlight */}
				<div className="relative bg-cream-gradient overflow-hidden flex flex-col justify-between min-h-[440px] lg:min-h-[520px] border-t md:border-t-0 md:border-l border-foreground/15">
					<div className="px-8 sm:px-10 lg:px-12 pt-10 lg:pt-14">
						<h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[0.95]">
							20G
							<br />
							<span className="font-medium">Protein</span>
						</h2>
						<p className="mt-3 text-sm text-foreground/70 max-w-[26ch]">
							In every cookie square — without the chalky aftertaste.
						</p>
					</div>

					<div className="relative h-[260px] sm:h-[300px] lg:h-[340px] w-full">
						<Image
							src="/scraped-0.jpg"
							alt="Stack of protein cookie squares"
							fill
							sizes="(max-width: 768px) 100vw, 40vw"
							className="object-contain object-bottom"
							priority
						/>
					</div>

					{/* Floating badge */}
					<div className="absolute top-6 right-6 flex flex-col items-center justify-center h-16 w-16 sm:h-20 sm:w-20 bg-[var(--cobalt)] text-white rotate-3 shadow-[0_8px_24px_rgba(27,63,160,0.35)]">
						<span className="text-[10px] sm:text-xs uppercase tracking-wider leading-none">New</span>
						<span className="text-base sm:text-lg font-semibold mt-1 leading-none">Batch</span>
					</div>
				</div>
			</div>
		</section>
	);
}
