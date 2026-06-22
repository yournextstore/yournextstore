import Image from "next/image";

export function Editorial() {
	return (
		<section className="bg-[var(--cream)]">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 lg:py-32">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
					{/* Image */}
					<div className="lg:col-span-5 lg:col-start-1 order-2 lg:order-1">
						<div className="relative aspect-[3/4] overflow-hidden rounded-sm">
							<Image
								src="/scraped-0.jpg"
								alt="A quiet portrait"
								fill
								sizes="(max-width: 1024px) 100vw, 40vw"
								className="object-cover grayscale"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
						</div>
						<p className="mt-4 text-[10px] tracking-[0.3em] uppercase text-foreground/55">
							Photographed by Asta Lund — Copenhagen, 2024
						</p>
					</div>

					{/* Quote */}
					<div className="lg:col-span-6 lg:col-start-7 order-1 lg:order-2">
						<p className="text-[10px] tracking-[0.32em] uppercase text-foreground/60 mb-6">
							— Our philosophy
						</p>
						<blockquote className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-[56px] leading-[1.1] text-foreground">
							"Nurturing is not a routine — it is the slowest, kindest form of attention. We design quiet
							objects for the people who give it."
						</blockquote>
						<div className="mt-10 flex items-center gap-4">
							<span className="h-px w-12 bg-foreground/40" />
							<span className="text-[11px] tracking-[0.28em] uppercase text-foreground/70">
								Ida & Mikkel — Founders
							</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
