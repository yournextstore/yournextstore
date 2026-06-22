import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section aria-label="Featured campaign" className="relative">
			<div className="grid grid-cols-1 lg:grid-cols-[minmax(320px,38%)_1fr] min-h-[460px] sm:min-h-[520px] lg:min-h-[560px]">
				<div className="bg-hero-mint relative flex items-center px-6 sm:px-12 lg:px-16 py-12 lg:py-0">
					<div
						className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-white/40 blur-xl"
						aria-hidden="true"
					/>
					<div
						className="absolute bottom-12 right-10 h-16 w-16 rounded-full bg-[var(--color-blush)]/60 blur-xl"
						aria-hidden="true"
					/>
					<div className="relative max-w-md">
						<span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--color-ink)] backdrop-blur-sm">
							<span className="h-1.5 w-1.5 rounded-full bg-[var(--color-peach)]" aria-hidden="true" />
							Spring &amp; Summer 2026
						</span>
						<h1
							className="mt-6 font-heading text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.05] tracking-tight text-[var(--color-ink)]"
							style={{ fontVariationSettings: "'SOFT' 100" }}
						>
							Joy in every routine!
						</h1>
						<p className="mt-5 text-base sm:text-lg text-[var(--color-ink)]/70 leading-relaxed">
							Whatever your routine this spring — upbeat, laid-back, or somewhere in between — the YNS Jellies
							are keeping things bright and full of cheer.
						</p>
						<div className="mt-9 flex flex-col sm:flex-row gap-3">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex items-center justify-center h-12 px-7 rounded-full border-[1.5px] border-[var(--color-ink)] text-[var(--color-ink)] text-sm font-semibold tracking-wide bg-transparent hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] transition-colors"
							>
								Meet spring &amp; summer Jellies
							</YnsLink>
						</div>
						<div className="mt-10 flex items-center gap-2" aria-hidden="true">
							<span className="h-2 w-6 rounded-full bg-[var(--color-ink)]" />
							<span className="h-2 w-2 rounded-full bg-[var(--color-ink)]/30" />
							<span className="h-2 w-2 rounded-full bg-[var(--color-ink)]/30" />
						</div>
					</div>
				</div>
				<div className="relative bg-hero-blush overflow-hidden">
					<Image
						src="/scraped-0.jpg"
						alt="A whimsical plush scene featuring soft characters in a pastel studio"
						fill
						priority
						sizes="(max-width: 1024px) 100vw, 62vw"
						className="object-cover"
					/>
					<div
						className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--color-mint)]/40 to-transparent pointer-events-none"
						aria-hidden="true"
					/>
					<div className="absolute bottom-6 right-6 hidden md:flex items-center gap-2 rounded-full bg-white/80 backdrop-blur px-4 py-2 text-xs font-medium text-[var(--color-ink)] shadow-sm">
						<span className="h-2 w-2 rounded-full bg-[var(--color-mint-deep)]" />
						New colorways just arrived
					</div>
				</div>
			</div>
		</section>
	);
}
