import Image from "next/image";
import { YnsLink } from "../yns-link";

type HeroProps = {
	previewMode?: boolean;
};

export function Hero({ previewMode = false }: HeroProps) {
	const collectionsHref = previewMode ? "/products?preview=1" : "/products";
	const editorialHref = previewMode ? "/collection/women?preview=1" : "/collection/women";

	return (
		<section className="hero-gradient">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				{/* Breadcrumb */}
				<div className="pt-6 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
					<YnsLink
						href={previewMode ? "/?preview=1" : "/"}
						className="hover:text-foreground transition-colors"
					>
						Home
					</YnsLink>
					<span className="mx-2">/</span>
					<YnsLink href={editorialHref} className="hover:text-foreground transition-colors">
						Women
					</YnsLink>
					<span className="mx-2">/</span>
					<span className="text-foreground">Tops</span>
				</div>

				{/* Editorial title row */}
				<div className="pt-8 sm:pt-12 pb-10 sm:pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
					<div className="lg:col-span-7">
						<h1 className="font-display font-light text-foreground text-[56px] sm:text-[80px] lg:text-[112px] xl:text-[128px] leading-[0.92] tracking-[-0.02em]">
							Women&rsquo;s Tops
							<sup className="font-mono-cap text-[12px] sm:text-[14px] align-top ml-2 sm:ml-3 -top-6 sm:-top-12 relative text-muted-foreground tracking-[0.18em]">
								139
							</sup>
						</h1>
						<p className="mt-6 max-w-md text-base sm:text-lg leading-relaxed text-muted-foreground">
							An editorial edit of cropped shirts, silk blouses, and sculptural knits for the season ahead.
							Quietly considered. Wear it everywhere.
						</p>
						<div className="mt-8 flex flex-wrap gap-2.5">
							<YnsLink
								href={collectionsHref}
								className="inline-flex items-center justify-center h-11 px-7 bg-foreground text-primary-foreground text-[11px] uppercase tracking-[0.22em] font-medium hover:bg-ink-soft transition-colors"
							>
								Shop the edit
							</YnsLink>
							<YnsLink
								href={previewMode ? "/products?preview=1" : "/products"}
								className="inline-flex items-center justify-center h-11 px-7 border border-foreground text-foreground text-[11px] uppercase tracking-[0.22em] font-medium hover:bg-accent/40 transition-colors"
							>
								View all 139
							</YnsLink>
						</div>
					</div>

					{/* Editorial image stack */}
					<div className="lg:col-span-5 relative hidden lg:block">
						<div className="relative aspect-[3/4] gallery-frame overflow-hidden">
							<Image
								src="/scraped-0.jpg"
								alt="Cropped lavender cotton shirt — editorial still life"
								fill
								sizes="(max-width: 1024px) 100vw, 40vw"
								priority
								className="object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent" />
						</div>
						<div className="absolute -bottom-6 -left-6 w-[42%] aspect-[3/4] overflow-hidden gallery-frame border-8 border-background shadow-[0_24px_60px_-30px_rgba(26,26,26,0.25)]">
							<Image
								src="/scraped-3.jpg"
								alt="Silk scarf detail"
								fill
								sizes="(max-width: 1024px) 50vw, 25vw"
								className="object-cover"
							/>
						</div>
					</div>
				</div>

				{/* Filter chips row */}
				<div className="pb-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
					<div className="flex flex-wrap items-center gap-2.5">
						<button
							type="button"
							className="inline-flex items-center gap-2 h-9 px-4 rounded-full bg-foreground text-primary-foreground text-[11px] uppercase tracking-[0.18em] font-medium"
						>
							Filters
							<span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent/30 text-primary-foreground text-[10px]">
								3
							</span>
						</button>
						<button
							type="button"
							className="inline-flex items-center gap-2 h-9 px-4 rounded-full border border-foreground text-foreground text-[11px] uppercase tracking-[0.18em]"
						>
							Tops <span aria-hidden>×</span>
						</button>
						<button
							type="button"
							className="inline-flex items-center gap-2 h-9 px-4 rounded-full border border-foreground text-foreground text-[11px] uppercase tracking-[0.18em]"
						>
							Size M <span aria-hidden>×</span>
						</button>
						<button
							type="button"
							className="inline-flex items-center gap-2 h-9 px-4 rounded-full border border-foreground text-foreground text-[11px] uppercase tracking-[0.18em]"
						>
							$100 – $300 <span aria-hidden>×</span>
						</button>
					</div>
					<button
						type="button"
						className="inline-flex items-center gap-2 h-9 px-4 rounded-full border border-border text-foreground text-[11px] uppercase tracking-[0.18em]"
					>
						Sort by
						<svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
							<path d="m1 1 4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
						</svg>
					</button>
				</div>
			</div>
		</section>
	);
}
