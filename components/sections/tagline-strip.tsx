import { ArrowRight } from "lucide-react";
import { YnsLink } from "../yns-link";

export function TaglineStrip() {
	return (
		<section className="relative bg-[var(--yns-red)] text-white overflow-hidden">
			<div className="absolute inset-0 yns-hero-gradient opacity-90" aria-hidden="true" />
			<div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
				<div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10">
					<h2 className="font-[family-name:var(--font-display)] italic text-[10vw] sm:text-[7vw] lg:text-[6.5rem] leading-[0.9] tracking-tight max-w-4xl">
						a softer, <span className="text-[var(--yns-cream)]">stranger</span>
						<br />
						way to fall asleep<span className="not-italic">.</span>
					</h2>
					<div className="flex flex-col gap-4 lg:items-end">
						<p className="max-w-sm text-sm text-white/85 leading-relaxed">
							formulated by a chronic insomniac. tested on tired editors, ballerinas, and one very dramatic
							cat. zero melatonin hangover.
						</p>
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="group inline-flex items-center gap-3 border border-white/70 px-7 h-12 text-xs uppercase tracking-[0.25em] hover:bg-white hover:text-[var(--yns-ink)] transition-colors"
						>
							meet the rituals
							<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
						</YnsLink>
					</div>
				</div>
			</div>
			<div className="relative border-t border-white/20">
				<div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 text-[10px] uppercase tracking-[0.3em] text-white/70 flex flex-wrap justify-between gap-x-6 gap-y-2">
					<span>· melatonin · l-theanine · magnesium glycinate ·</span>
					<span>· clinically dosed · vegan · third-party tested ·</span>
				</div>
			</div>
		</section>
	);
}
