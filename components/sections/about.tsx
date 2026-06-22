import Image from "next/image";
import { YnsLink } from "../yns-link";

export function About() {
	return (
		<section id="about" className="bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-16">
					<div className="lg:col-span-5 relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-blush">
						<Image
							src="/scraped-5.jpg"
							alt="Soft satin still life"
							fill
							sizes="(max-width: 1024px) 100vw, 40vw"
							className="object-cover"
						/>
						<div
							aria-hidden="true"
							className="absolute inset-0 bg-gradient-to-t from-magenta/10 via-transparent to-transparent"
						/>
					</div>

					<div className="lg:col-span-7">
						<span className="text-[11px] tracking-[0.28em] uppercase text-magenta font-semibold">
							Our Promise
						</span>
						<h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[1.05] tracking-tight">
							Body solutions for <span className="italic">every</span> body.
						</h2>
						<p className="mt-6 text-lg leading-relaxed text-foreground/75 max-w-xl">
							Your Next Store began as a love letter to the everyday — a curated line of skin-safe essentials
							designed to disappear under what you wear and stay put through what you do.
						</p>
						<p className="mt-4 text-lg leading-relaxed text-foreground/75 max-w-xl">
							From wedding-day confidence to sweaty pilates Sundays, every silhouette is fit-tested across the
							size and shade spectrum, then made to last in soft, reusable medical-grade silicone.
						</p>
						<div className="mt-10 flex flex-col sm:flex-row gap-3">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex items-center justify-center h-12 px-7 rounded-full bg-magenta text-white text-[12px] tracking-[0.18em] uppercase font-semibold hover:bg-magenta-deep transition-colors"
							>
								Find your fit
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="/faq"
								className="inline-flex items-center justify-center h-12 px-7 rounded-full border border-foreground/15 text-foreground text-[12px] tracking-[0.18em] uppercase font-semibold hover:bg-blush-soft transition-colors"
							>
								The Fit Guide
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
