import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

type HeroProps = {
	isPreview?: boolean;
};

export function Hero({ isPreview = false }: HeroProps) {
	const shopHref = isPreview ? "/products?preview=1" : "/products";
	const aboutHref = isPreview ? "/faq?preview=1" : "/faq";

	return (
		<section className="relative overflow-hidden bg-aura-hero grain">
			{/* Decorative SVG arch overlay */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 opacity-[0.06]"
				style={{
					backgroundImage: "radial-gradient(circle at 80% 30%, rgba(60,40,25,0.6) 1px, transparent 1px)",
					backgroundSize: "5px 5px",
				}}
			/>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-center min-h-[68vh] py-16 lg:py-24">
					{/* Left: editorial text */}
					<div className="relative z-10 max-w-xl animate-aura-rise">
						<p className="text-[11px] uppercase tracking-[0.32em] text-clay/80 mb-7 flex items-center gap-3">
							<span className="inline-block h-px w-8 bg-clay/60" aria-hidden="true" />
							Volume 04 · Spring Atelier
						</p>
						<h1 className="font-serif text-[44px] sm:text-6xl lg:text-7xl xl:text-[88px] leading-[0.95] tracking-[-0.01em] text-walnut text-balance">
							A quiet home,
							<br />
							<span className="italic text-clay">slowly</span> made
							<br />
							by hand.
						</h1>
						<p className="mt-8 max-w-md text-base sm:text-lg text-espresso/75 leading-relaxed text-pretty">
							Stone, clay, wool and linen — each object in this season&apos;s collection is shaped by a single
							maker, finished beneath warm Mediterranean light.
						</p>
						<div className="mt-10 flex flex-col sm:flex-row gap-3">
							<YnsLink
								prefetch={"eager"}
								href={shopHref}
								className="group inline-flex items-center justify-center gap-3 h-12 px-7 bg-espresso text-cream rounded-full text-[12px] uppercase tracking-[0.22em] font-medium hover:bg-walnut transition-colors"
							>
								Shop the Collection
								<ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href={aboutHref}
								className="inline-flex items-center justify-center gap-2 h-12 px-7 border border-clay/40 text-espresso rounded-full text-[12px] uppercase tracking-[0.22em] font-medium hover:bg-sand/60 transition-colors"
							>
								Read the Journal
							</YnsLink>
						</div>

						<div className="mt-14 flex items-center gap-8 text-[11px] uppercase tracking-[0.22em] text-espresso/55">
							<span>Handmade · Italy</span>
							<span className="h-px w-8 bg-espresso/30" aria-hidden="true" />
							<span>Lifetime Repair</span>
						</div>
					</div>

					{/* Right: editorial product still life */}
					<div className="relative h-[420px] sm:h-[520px] lg:h-[620px]">
						{/* Background arch shape */}
						<div
							aria-hidden="true"
							className="absolute inset-0 bg-aura-sand"
							style={{
								borderRadius: "50% 50% 12px 12px / 60% 60% 12px 12px",
								boxShadow: "inset 0 -40px 80px rgba(139,94,60,0.18)",
							}}
						/>
						{/* Featured image */}
						<div className="absolute inset-6 sm:inset-10 overflow-hidden rounded-t-[280px] rounded-b-md shadow-[0_30px_80px_-30px_rgba(60,42,30,0.45)]">
							<Image
								src="/scraped-0.jpg"
								alt="Hand-carved travertine vase with dried pampas grass in warm morning light"
								fill
								priority
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover"
							/>
							<div
								aria-hidden="true"
								className="absolute inset-0 bg-gradient-to-t from-walnut/30 via-transparent to-cream/10"
							/>
						</div>
						{/* Floating caption tag */}
						<div className="hidden sm:flex absolute bottom-8 -left-2 lg:left-6 items-center gap-3 bg-cream/95 backdrop-blur-sm px-4 py-3 rounded-full shadow-lg border border-border/40">
							<span className="h-2 w-2 rounded-full bg-clay" aria-hidden="true" />
							<span className="text-[11px] uppercase tracking-[0.2em] text-espresso/80">
								Pedestal Vase · Travertine
							</span>
						</div>
						{/* Floating price tag */}
						<div className="hidden lg:block absolute top-12 -right-4 bg-walnut text-cream px-5 py-4 rounded-md shadow-xl rotate-[3deg]">
							<p className="font-serif text-[11px] uppercase tracking-[0.22em] opacity-70">From</p>
							<p className="font-serif text-2xl mt-0.5">$188</p>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom soft divider */}
			<div
				aria-hidden="true"
				className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-b from-transparent to-cream"
			/>
		</section>
	);
}
