import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Promo() {
	return (
		<section className="bg-background py-20 sm:py-28">
			<div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
				<div className="relative grid lg:grid-cols-12 gap-0 rounded-[2.5rem] overflow-hidden bg-clay-gradient">
					{/* Decorative SVG ornament */}
					<svg
						aria-hidden="true"
						className="absolute top-8 right-8 h-16 w-16 text-[var(--olive-deep)] opacity-30"
						viewBox="0 0 100 100"
						fill="none"
						stroke="currentColor"
						strokeWidth="1"
					>
						<circle cx="50" cy="50" r="40" />
						<path d="M50 10 L 50 90 M 10 50 L 90 50" strokeWidth="0.5" />
						<circle cx="50" cy="50" r="20" />
						<circle cx="50" cy="50" r="6" fill="currentColor" />
					</svg>

					<div className="lg:col-span-7 px-8 py-16 sm:p-16 lg:p-20 relative z-10">
						<span className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-[var(--olive-deep)]/70 mb-6">
							<span className="h-px w-8 bg-[var(--olive-deep)]/40" />
							Welcome offer
						</span>
						<h2 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-[var(--olive-deep)]">
							Get <span className="text-[var(--cream)] inline-block px-2 italic font-light">20% off</span>
							<br />
							your <em className="italic font-light">first</em> purchase
						</h2>
						<p className="mt-6 text-[var(--olive-deep)]/75 max-w-md leading-relaxed">
							Subscribe for early access to new editions, refill drops, and slow-stock alerts. We send a
							thoughtful note no more than twice a month.
						</p>

						<form className="mt-10 flex flex-col sm:flex-row gap-3 max-w-lg">
							<input
								type="email"
								name="email"
								placeholder="your@email.com"
								required
								className="h-12 flex-1 rounded-full bg-[var(--cream)]/80 border border-[var(--olive-deep)]/15 px-6 text-sm text-[var(--olive-deep)] placeholder:text-[var(--olive-deep)]/40 focus:border-[var(--olive-deep)]/50 focus:bg-[var(--cream)] outline-none transition-all"
							/>
							<button
								type="submit"
								className="group h-12 inline-flex items-center justify-center gap-2 px-8 bg-[var(--olive-deep)] text-[var(--cream)] rounded-full text-sm font-medium hover:bg-[var(--olive)] transition-colors"
							>
								Claim 20% off
								<ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
							</button>
						</form>

						<p className="mt-4 text-[11px] tracking-[0.18em] uppercase text-[var(--olive-deep)]/50">
							No spam — unsubscribe at any time
						</p>
					</div>

					<div className="lg:col-span-5 relative min-h-[280px] lg:min-h-0">
						<Image
							src="/scraped-0.jpg"
							alt="Featured product set"
							fill
							sizes="(max-width: 1024px) 100vw, 40vw"
							className="object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-l from-transparent to-[var(--clay)]/30 lg:hidden" />

						<YnsLink
							href="/products"
							className="absolute bottom-6 right-6 flex items-center gap-2 backdrop-blur-md bg-[var(--cream)]/90 rounded-full pl-5 pr-2 py-2 text-xs font-medium text-[var(--olive-deep)] hover:bg-[var(--cream)] transition-colors"
						>
							Shop the look
							<span className="h-7 w-7 rounded-full bg-[var(--olive-deep)] text-[var(--cream)] flex items-center justify-center">
								<ArrowUpRight className="h-3.5 w-3.5" />
							</span>
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
