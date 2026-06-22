import Image from "next/image";

export function Source() {
	return (
		<section className="relative bg-yns-navy text-yns-cream overflow-hidden">
			<div className="relative h-[80vh] min-h-[560px]">
				<Image
					src="/scraped-2.jpg"
					alt="Sweeping landscape of a misty lake at dawn"
					fill
					sizes="100vw"
					className="object-cover opacity-80"
				/>
				<div
					aria-hidden
					className="absolute inset-0 bg-gradient-to-b from-yns-navy/40 via-yns-navy/10 to-yns-navy/80"
				/>
				<div className="relative z-10 h-full flex items-end">
					<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pb-20 sm:pb-28 grid grid-cols-1 lg:grid-cols-12 gap-10 w-full">
						<div className="lg:col-span-5 lg:col-start-7">
							<p className="text-[11px] tracking-[0.22em] uppercase text-yns-yellow font-medium">
								The Source
							</p>
							<h2 className="mt-4 font-display text-4xl sm:text-5xl text-white leading-[1.05]">
								Drawn from a spring <span className="italic">most people will never see.</span>
							</h2>
							<p className="mt-6 text-white/85 text-[15px] leading-relaxed max-w-md">
								Our spring rises in a protected watershed of the Cascades, 4,200 feet above sea level. The
								land around it has been undisturbed for more than a century and the closest paved road is six
								miles away.
							</p>
							<div className="mt-8 grid grid-cols-3 gap-6 max-w-md">
								<div>
									<div className="font-display text-3xl text-yns-yellow">4,200</div>
									<div className="text-[11px] tracking-[0.18em] uppercase text-white/60 mt-1">
										Feet elevation
									</div>
								</div>
								<div>
									<div className="font-display text-3xl text-yns-yellow">19</div>
									<div className="text-[11px] tracking-[0.18em] uppercase text-white/60 mt-1">
										Years filtered
									</div>
								</div>
								<div>
									<div className="font-display text-3xl text-yns-yellow">0</div>
									<div className="text-[11px] tracking-[0.18em] uppercase text-white/60 mt-1">
										Trucks per gallon
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
