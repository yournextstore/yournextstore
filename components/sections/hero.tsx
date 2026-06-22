import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-6 sm:pt-10">
				<div className="relative overflow-hidden rounded-[28px] ring-1 ring-border/60 shadow-[0_30px_80px_-30px_rgba(60,50,40,0.35)]">
					{/* Background image with SVG fallback */}
					<div className="relative aspect-[16/10] sm:aspect-[16/8] lg:aspect-[16/7] w-full">
						<Image
							src="/scraped-4.jpg"
							alt="Editorial campaign in a sun-drenched wheat field"
							fill
							priority
							sizes="(max-width: 1400px) 100vw, 1400px"
							className="object-cover object-[center_30%]"
						/>
						{/* Layered SVG overlay for depth + golden haze */}
						<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,oklch(0.92_0.08_82/0.18)_0%,transparent_55%)]" />
						<div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/55 via-black/25 to-transparent" />

						{/* Small floating chip top-left */}
						<div className="absolute top-5 left-5 sm:top-7 sm:left-8 flex items-center gap-2 rounded-full bg-bone/85 backdrop-blur-md pl-2 pr-3.5 py-1.5 text-[11px] tracking-[0.18em] uppercase text-charcoal shadow-sm">
							<span className="inline-block h-1.5 w-1.5 rounded-full bg-bronze" />
							New · Summer 2026
						</div>

						{/* Lookbook caption top-right */}
						<div className="absolute top-5 right-5 sm:top-7 sm:right-8 hidden md:flex flex-col items-end text-[10px] tracking-[0.32em] uppercase text-bone/85">
							<span>Lookbook</span>
							<span className="mt-1 h-px w-12 bg-bone/60" />
							<span className="mt-1">№ 014</span>
						</div>

						{/* Bottom overlay copy */}
						<div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-14">
							<div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
								<div className="max-w-2xl">
									<p className="text-bone/80 text-[11px] tracking-[0.32em] uppercase mb-4 sm:mb-5">
										YNS · Spring/Summer Edit
									</p>
									<h1 className="font-display text-bone text-[40px] leading-[1.02] sm:text-6xl lg:text-7xl tracking-[-0.01em] text-balance">
										Your Next Store
										<br />
										<span className="italic text-clay/90 font-normal">Spring Collection</span>
									</h1>
									<p className="hidden sm:block mt-5 max-w-md text-bone/75 text-sm leading-relaxed">
										Sun-bleached neutrals, weightless linen, and the quiet kind of tailoring you reach for
										first. Pre-order the season&apos;s defining pieces before they ship next week.
									</p>
								</div>
								<div className="flex items-center gap-3">
									<YnsLink
										href="/products"
										prefetch={"eager"}
										className="group inline-flex items-center gap-2 h-12 pl-6 pr-2 bg-bone text-charcoal rounded-full text-sm font-medium tracking-wide hover:bg-clay/40 hover:text-charcoal transition-all"
									>
										Shop the edit
										<span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-charcoal text-bone group-hover:bg-charcoal/90 transition-colors">
											<ArrowUpRight className="h-4 w-4" />
										</span>
									</YnsLink>
									<YnsLink
										href="#collection"
										prefetch={"eager"}
										className="hidden sm:inline-flex items-center h-12 px-6 rounded-full text-sm font-medium tracking-wide text-bone border border-bone/30 hover:bg-bone/10 transition-colors"
									>
										Explore lookbook
									</YnsLink>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Marquee strip beneath hero */}
				<div className="mt-6 sm:mt-8 overflow-hidden border-y border-border/70 py-3">
					<div className="flex gap-12 animate-marquee whitespace-nowrap text-[11px] tracking-[0.32em] uppercase text-foreground/70">
						{Array.from({ length: 2 }).map((_, i) => (
							<div key={`marquee-${i}`} className="flex shrink-0 items-center gap-12">
								<span>Ethically crafted</span>
								<span aria-hidden="true">✦</span>
								<span>Made in small batches</span>
								<span aria-hidden="true">✦</span>
								<span>Natural fibres only</span>
								<span aria-hidden="true">✦</span>
								<span>Complimentary returns</span>
								<span aria-hidden="true">✦</span>
								<span>Editorial since 2018</span>
								<span aria-hidden="true">✦</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
