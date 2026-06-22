import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-cream-gradient">
			{/* Decorative botanical SVGs */}
			<svg
				aria-hidden="true"
				className="absolute -top-20 -left-24 w-[420px] h-[420px] text-[var(--olive)] opacity-[0.18] -rotate-12"
				viewBox="0 0 200 200"
				fill="none"
				stroke="currentColor"
				strokeWidth="0.6"
			>
				<path d="M100 20 C 60 60, 50 100, 100 180 C 150 100, 140 60, 100 20 Z" />
				<path d="M100 20 L 100 180" />
				<path d="M100 50 L 75 38" />
				<path d="M100 70 L 130 55" />
				<path d="M100 90 L 70 75" />
				<path d="M100 110 L 135 95" />
				<path d="M100 130 L 75 115" />
				<path d="M100 150 L 130 138" />
			</svg>
			<svg
				aria-hidden="true"
				className="absolute -bottom-32 -right-20 w-[520px] h-[520px] text-[var(--olive)] opacity-[0.15] rotate-12"
				viewBox="0 0 200 200"
				fill="none"
				stroke="currentColor"
				strokeWidth="0.6"
			>
				<path d="M100 20 C 60 60, 50 100, 100 180 C 150 100, 140 60, 100 20 Z" />
				<path d="M100 20 L 100 180" />
				<path d="M100 50 L 75 38" />
				<path d="M100 70 L 130 55" />
				<path d="M100 90 L 70 75" />
				<path d="M100 110 L 135 95" />
				<path d="M100 130 L 75 115" />
			</svg>

			<div className="relative max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
				<div className="grid lg:grid-cols-12 gap-10 items-center py-16 sm:py-24 lg:py-32">
					{/* Left copy */}
					<div className="lg:col-span-7 relative">
						<span className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-[var(--olive)] font-medium mb-8">
							<span className="h-px w-8 bg-[var(--olive)]" />
							Spring 2026 Edition
						</span>
						<h1 className="font-display text-[clamp(3rem,7vw,6.25rem)] leading-[1.02] tracking-tight text-[var(--olive-deep)]">
							Products that <em className="italic font-normal text-[var(--olive)]">Care</em> for{" "}
							<span className="relative inline-block">
								<span className="relative z-10">You</span>
								<svg
									className="absolute -bottom-2 left-0 w-full h-4 text-[var(--olive)] opacity-50"
									viewBox="0 0 100 12"
									preserveAspectRatio="none"
									aria-hidden="true"
								>
									<path
										d="M2 8 Q 25 2, 50 6 T 98 5"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
									/>
								</svg>
							</span>
							<br />
							and our <em className="italic font-normal text-[var(--olive)]">Planet</em>
						</h1>
						<p className="mt-8 text-base sm:text-lg text-[var(--stone)] leading-relaxed max-w-lg">
							Slow goods, sourced honestly. Refillable rituals, recyclable packaging, and craftsmanship you
							can feel — for a home that loves you back.
						</p>
						<div className="mt-10 flex flex-col sm:flex-row gap-4">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="group inline-flex items-center justify-center gap-2 h-12 px-8 bg-[var(--olive-deep)] text-[var(--cream)] rounded-full text-sm tracking-wide font-medium hover:bg-[var(--olive)] transition-all shadow-[0_8px_24px_-12px_rgb(56_70_38/0.5)]"
							>
								Shop Collection
								<ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="#mission"
								className="inline-flex items-center justify-center gap-2 h-12 px-8 border border-[var(--olive-deep)]/30 text-[var(--olive-deep)] rounded-full text-sm tracking-wide font-medium hover:bg-[var(--olive-deep)]/5 transition-colors"
							>
								Read Our Story
							</YnsLink>
						</div>

						{/* Trust badges */}
						<div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4 text-[11px] tracking-[0.18em] uppercase text-[var(--stone)]">
							<span className="flex items-center gap-2">
								<span className="h-1.5 w-1.5 rounded-full bg-[var(--olive)]" />
								Certified B-Corp
							</span>
							<span className="flex items-center gap-2">
								<span className="h-1.5 w-1.5 rounded-full bg-[var(--olive)]" />
								1% for the Planet
							</span>
							<span className="flex items-center gap-2">
								<span className="h-1.5 w-1.5 rounded-full bg-[var(--olive)]" />
								Carbon-neutral shipping
							</span>
						</div>
					</div>

					{/* Right visual */}
					<div className="lg:col-span-5 relative">
						<div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-clay-gradient shadow-[0_30px_80px_-30px_rgb(56_70_38/0.35)]">
							<Image
								src="/scraped-2.jpg"
								alt="Curated botanical care products"
								fill
								priority
								sizes="(max-width: 1024px) 100vw, 40vw"
								className="object-cover mix-blend-multiply"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-[var(--olive-deep)]/30 via-transparent to-transparent" />

							{/* Floating product card */}
							<div className="absolute bottom-6 left-6 right-6 backdrop-blur-md bg-[var(--cream)]/85 rounded-2xl p-4 flex items-center gap-3 border border-white/40">
								<div className="h-12 w-12 rounded-full bg-[var(--olive-deep)] flex items-center justify-center text-[var(--cream)] font-display text-lg">
									01
								</div>
								<div className="flex-1">
									<p className="text-[10px] tracking-[0.2em] uppercase text-[var(--stone)]">Bestseller</p>
									<p className="text-sm font-medium text-[var(--olive-deep)]">The Daily Ritual Set</p>
								</div>
								<span className="font-display text-lg text-[var(--olive-deep)]">$48</span>
							</div>
						</div>

						{/* Decorative seal */}
						<div className="absolute -top-6 -left-6 sm:-left-12 h-28 w-28 rounded-full bg-[var(--cream)] border border-[var(--olive)]/30 flex items-center justify-center">
							<svg
								className="absolute inset-0 w-full h-full animate-[spin_24s_linear_infinite]"
								viewBox="0 0 100 100"
								aria-hidden="true"
							>
								<defs>
									<path id="circ" d="M 50 50 m -38 0 a 38 38 0 1 1 76 0 a 38 38 0 1 1 -76 0" />
								</defs>
								<text className="fill-[var(--olive-deep)] text-[8px] tracking-[0.3em] uppercase font-medium">
									<textPath href="#circ">Naturally crafted • Slow made • Honest goods •</textPath>
								</text>
							</svg>
							<svg
								className="h-8 w-8 text-[var(--olive-deep)]"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.4"
								aria-hidden="true"
							>
								<path d="M12 2 C 7 6, 5 11, 12 22 C 19 11, 17 6, 12 2 Z" strokeLinejoin="round" />
								<path d="M12 2 L 12 22" strokeLinecap="round" />
							</svg>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
