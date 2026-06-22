import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-secondary">
			{/* Oversized wordmark watermark */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 flex flex-col items-center justify-between py-6 select-none"
			>
				<span className="text-[14vw] sm:text-[12vw] font-display font-semibold tracking-tighter text-foreground/[0.04] leading-none whitespace-nowrap">
					YOUR · NEXT · STORE
				</span>
				<span className="text-[14vw] sm:text-[12vw] font-display font-semibold tracking-tighter text-foreground/[0.04] leading-none whitespace-nowrap">
					LEATHER · ATELIER
				</span>
			</div>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="pt-10 sm:pt-14 pb-16 sm:pb-24">
					{/* Top row: headline left, tagline+CTA right */}
					<div className="grid lg:grid-cols-12 gap-10 items-start">
						<div className="lg:col-span-8">
							<h1 className="font-display text-[44px] leading-[1.02] sm:text-6xl lg:text-[88px] font-medium tracking-[-0.03em] text-foreground">
								Best Leather Bag
								<br />
								Collection For You
							</h1>
							<div className="mt-6 flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-muted-foreground">
								<span className="inline-block h-px w-10 bg-foreground/40" />
								<span>2024 · Present</span>
							</div>
						</div>
						<div className="lg:col-span-4 lg:pt-6 flex flex-col gap-6">
							<div className="flex items-start gap-3 text-base text-foreground/80 leading-relaxed">
								<svg
									width="22"
									height="22"
									viewBox="0 0 22 22"
									fill="none"
									aria-hidden="true"
									className="mt-1 shrink-0"
								>
									<title>arrow</title>
									<path d="M3 11h16M11 3v16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
									<path
										d="M6 6l10 10M16 6L6 16"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
									/>
								</svg>
								<p>
									Discover the epitome of style and craftsmanship with our curated leather goods — heirloom
									pieces, built to age beautifully.
								</p>
							</div>
							<div>
								<YnsLink
									prefetch={"eager"}
									href="#products"
									className="inline-flex items-center gap-2 rounded-full bg-foreground text-background h-12 px-6 text-sm font-medium hover:bg-foreground/90 transition-colors"
								>
									Start Shopping
									<ArrowRightIcon className="h-4 w-4" />
								</YnsLink>
							</div>
						</div>
					</div>

					{/* Hero product image */}
					<div className="mt-10 sm:mt-14 relative">
						<div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-[32px] overflow-hidden bg-gradient-to-br from-cream via-secondary to-accent shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)]">
							<Image
								src="/scraped-0.jpg"
								alt="Featured leather bag"
								fill
								sizes="(max-width: 1024px) 100vw, 1280px"
								priority
								className="object-cover object-center"
							/>
							{/* Soft vignette */}
							<div
								aria-hidden="true"
								className="absolute inset-0 bg-gradient-to-t from-foreground/10 via-transparent to-transparent"
							/>
							{/* Small float caption */}
							<div className="absolute left-6 bottom-6 sm:left-10 sm:bottom-10 inline-flex items-center gap-3 rounded-full bg-background/90 backdrop-blur-md border border-border px-4 py-2">
								<span className="h-2 w-2 rounded-full bg-tan" />
								<span className="text-xs uppercase tracking-[0.22em] text-foreground/80">
									Vegetable-tanned · Lifetime repairs
								</span>
							</div>
							<div className="absolute right-6 top-6 sm:right-10 sm:top-10 hidden sm:flex flex-col items-end gap-1 rounded-2xl bg-background/85 backdrop-blur-md border border-border px-4 py-3">
								<span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
									Featured
								</span>
								<span className="font-display text-lg text-foreground">The Atelier Tote</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
