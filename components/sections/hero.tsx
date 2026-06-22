import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative bg-[var(--cream)]">
			<div className="relative w-full aspect-[16/8] sm:aspect-[16/7] lg:aspect-[16/6.2] overflow-hidden">
				{/* Cinematic stripe backdrop using ticking pattern + photographic overlay */}
				<div aria-hidden="true" className="absolute inset-0 heritage-ticking opacity-90" />
				<Image
					src="/scraped-0.jpg"
					alt=""
					fill
					sizes="100vw"
					priority
					className="object-cover opacity-70 mix-blend-multiply"
				/>
				<div
					aria-hidden="true"
					className="absolute inset-0"
					style={{
						background:
							"radial-gradient(ellipse at 20% 30%, rgba(15,14,12,0.35), transparent 60%), linear-gradient(120deg, rgba(63,28,30,0.25) 0%, transparent 45%, rgba(15,14,12,0.45) 100%)",
					}}
				/>

				{/* Foreground composition — keep minimal per reference (no overlay text) */}
				<div className="relative h-full flex items-end">
					<div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-6 sm:pb-10 lg:pb-14 flex items-end justify-between">
						<div className="flex flex-col gap-3 sm:gap-4">
							<span className="heritage-smallcaps text-[var(--cream)]/85">
								No. 01 — Heirloom Mattress, hand-tufted
							</span>
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex items-center gap-3 self-start border-b border-[var(--cream)] pb-1 text-[var(--cream)] font-display italic text-base sm:text-lg tracking-tight hover:text-[var(--sand)] hover:border-[var(--sand)] transition-colors"
							>
								Browse the collection
								<span aria-hidden="true">→</span>
							</YnsLink>
						</div>
						<span className="hidden sm:flex items-center gap-2 text-[var(--cream)]/80">
							<span className="h-1.5 w-1.5 rounded-full bg-[var(--cream)]" />
							<span className="h-1.5 w-1.5 rounded-full bg-[var(--cream)]/35" />
							<span className="h-1.5 w-1.5 rounded-full bg-[var(--cream)]/35" />
						</span>
					</div>
				</div>
			</div>

			{/* Carousel dots — matches the reference's pagination dots under the hero */}
			<div className="flex justify-center gap-2 py-4">
				<span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--ink)]" />
				<span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--ink)]/25" />
				<span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--ink)]/25" />
			</div>
		</section>
	);
}
