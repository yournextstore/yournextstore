import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function About() {
	return (
		<section id="story" className="brick-cream-gradient">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid lg:grid-cols-2 items-center gap-12 lg:gap-20">
					{/* Left — lifestyle product image */}
					<div className="relative">
						<div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-[color:var(--brick-cream-deep)] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.18)]">
							<Image
								src="/scraped-2.jpg"
								alt="A hand holding the Your Next Store device"
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover"
								priority={false}
							/>
							<div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/20" />
						</div>
						{/* Decorative chip */}
						<div className="absolute -bottom-6 left-6 sm:left-10 inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-white shadow-lg">
							<span className="h-2 w-2 rounded-full bg-[color:var(--brick-lavender)]" />A simple, focused
							device
						</div>
					</div>

					{/* Right — copy */}
					<div className="max-w-lg">
						<span className="inline-block text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/60">
							Our Story
						</span>
						<h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.05]">
							Introducing Your Next Store
						</h2>
						<p className="mt-6 text-lg text-foreground/70 leading-relaxed">
							A small set of intentional products that temporarily remove distractions and notifications from
							your phone. Designed for simplicity. No subscriptions. No complex setups. Just more time for
							what matters.
						</p>

						<ul className="mt-8 space-y-3 text-sm text-foreground/80">
							{[
								"One-tap focus mode that pairs in seconds",
								"Works with iOS and Android — no apps required",
								"Crafted from recycled aluminum, made to last",
							].map((line) => (
								<li key={line} className="flex items-start gap-3">
									<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
									<span>{line}</span>
								</li>
							))}
						</ul>

						<div className="mt-10 flex flex-col sm:flex-row gap-3">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition-all hover:bg-[color:var(--brick-cobalt-deep)]"
							>
								Shop the collection
								<ArrowRight className="h-4 w-4" />
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="/faq"
								className="inline-flex h-12 items-center justify-center rounded-full border border-foreground/15 px-6 text-sm font-medium text-foreground transition-colors hover:bg-white"
							>
								Read the FAQ
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
