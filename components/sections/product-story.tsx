import Image from "next/image";
import { YnsLink } from "../yns-link";

export function ProductStory() {
	return (
		<section className="relative bg-[color:var(--color-yns-cream)]">
			<div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-28 lg:py-32">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
					<div className="lg:col-span-7 relative">
						<div className="relative aspect-[4/3] w-full overflow-hidden bg-[color:var(--color-yns-wood)]">
							<Image
								src="/scraped-1.jpg"
								alt="Travelers playing on a mountain ridge at golden hour"
								fill
								sizes="(max-width: 1024px) 100vw, 60vw"
								className="object-cover"
							/>
							<div
								aria-hidden="true"
								className="absolute inset-0 bg-gradient-to-tr from-[color:var(--color-yns-ink)]/30 via-transparent to-transparent pointer-events-none"
							/>
							<div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-[10px] sm:text-xs tracking-utility text-[color:var(--color-yns-cream)] font-semibold bg-[color:var(--color-yns-ink)]/40 backdrop-blur-sm px-3 py-2">
								FIELD-TESTED · ROCKIES, MAY 2026
							</div>
						</div>
					</div>
					<div className="lg:col-span-5 lg:pl-4">
						<p className="text-xs tracking-utility font-semibold text-[color:var(--color-yns-wood)] mb-5">
							CHAPTER 01 — THE SET
						</p>
						<h2 className="font-display text-4xl sm:text-5xl lg:text-[64px] font-black uppercase leading-[0.95] tracking-[-0.02em] text-[color:var(--color-yns-ink)]">
							From the cabin
							<br />
							to the cliffside.
						</h2>
						<p className="mt-6 text-base sm:text-lg leading-relaxed text-[color:var(--color-yns-ink)]/70 max-w-md">
							Every piece in the collection earns its place in the pack. We build for the long miles &mdash;
							cork that won&apos;t warp, leather that softens with use, hardware that survives the drop. This
							isn&apos;t cabin gear. It&apos;s gear that travels with you.
						</p>
						<div className="mt-8 flex items-center gap-6">
							<YnsLink
								prefetch="eager"
								href="#products"
								className="inline-flex items-center gap-3 text-[11px] tracking-utility font-bold text-[color:var(--color-yns-ink)] border-b-2 border-[color:var(--color-yns-ink)] pb-1.5 hover:border-[color:var(--color-yns-wood)] hover:text-[color:var(--color-yns-wood)] transition-colors"
							>
								SHOP THE SET
								<span aria-hidden="true" className="text-base">
									&rarr;
								</span>
							</YnsLink>
							<YnsLink
								prefetch="eager"
								href="/products"
								className="text-[11px] tracking-utility font-semibold text-[color:var(--color-yns-ink)]/60 hover:text-[color:var(--color-yns-ink)] transition-colors"
							>
								BROWSE ALL
							</YnsLink>
						</div>

						<dl className="mt-12 grid grid-cols-3 gap-4 border-t border-[color:var(--color-yns-ink)]/15 pt-8">
							<div>
								<dt className="text-[10px] tracking-utility font-semibold text-[color:var(--color-yns-ink)]/55">
									WEIGHT
								</dt>
								<dd className="font-display text-2xl font-black text-[color:var(--color-yns-ink)] mt-1">
									1.8 LB
								</dd>
							</div>
							<div>
								<dt className="text-[10px] tracking-utility font-semibold text-[color:var(--color-yns-ink)]/55">
									MATERIALS
								</dt>
								<dd className="font-display text-2xl font-black text-[color:var(--color-yns-ink)] mt-1">
									CORK · OAK
								</dd>
							</div>
							<div>
								<dt className="text-[10px] tracking-utility font-semibold text-[color:var(--color-yns-ink)]/55">
									WARRANTY
								</dt>
								<dd className="font-display text-2xl font-black text-[color:var(--color-yns-ink)] mt-1">
									LIFETIME
								</dd>
							</div>
						</dl>
					</div>
				</div>
			</div>
		</section>
	);
}
