import { YnsLink } from "@/components/yns-link";

export function PromoBanner() {
	return (
		<section className="bg-[var(--tizz-cream)] py-16">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="relative tizz-promo-gradient rounded-[2.5rem] overflow-hidden border-4 border-[var(--tizz-deep)] tizz-noise">
					<div className="relative grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 p-10 sm:p-14 lg:p-20 items-center">
						<div>
							<p className="tizz-overline text-[var(--tizz-yellow)] text-xs mb-5">Subscribe + save</p>
							<h2 className="tizz-display text-[var(--tizz-cream)] text-5xl sm:text-6xl lg:text-7xl leading-[0.9]">
								Save <span className="text-[var(--tizz-yellow)]">25%</span> when
								<br />
								you let us
								<br />
								keep the fridge
								<br />
								full.
							</h2>
							<p className="mt-6 max-w-md text-[var(--tizz-cream)]/85 text-lg leading-relaxed">
								Skip-anytime auto-ship. Free freight nationwide. No subscription crimes against your calendar.
							</p>
							<div className="mt-8 flex flex-wrap gap-3">
								<YnsLink
									href="/products"
									className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[var(--tizz-yellow)] text-[var(--tizz-deep)] tizz-overline text-sm hover:bg-[var(--tizz-cream)] transition-colors"
								>
									Start subscription →
								</YnsLink>
								<YnsLink
									href="/products"
									className="inline-flex items-center gap-2 px-7 py-4 rounded-full border-2 border-[var(--tizz-cream)] text-[var(--tizz-cream)] tizz-overline text-sm hover:bg-[var(--tizz-cream)] hover:text-[var(--tizz-deep)] transition-colors"
								>
									One-time buy
								</YnsLink>
							</div>
						</div>

						{/* Burst graphic */}
						<div className="relative hidden lg:block">
							<div className="relative aspect-square">
								<div className="absolute inset-0 flex items-center justify-center tizz-spin-slow">
									<svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
										<title>Discount burst</title>
										<path
											d="M100 5 L115 35 L145 25 L140 60 L175 70 L150 90 L185 110 L150 120 L160 155 L125 145 L115 180 L95 150 L65 175 L60 140 L25 145 L40 115 L5 100 L40 80 L20 50 L55 55 L55 20 L85 35 Z"
											fill="var(--tizz-yellow)"
											stroke="var(--tizz-deep)"
											strokeWidth="4"
										/>
									</svg>
								</div>
								<div className="absolute inset-0 flex items-center justify-center flex-col">
									<span className="tizz-display text-[var(--tizz-deep)] text-7xl leading-none">25%</span>
									<span className="tizz-overline text-[var(--tizz-deep)] text-xs mt-1">off forever</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
