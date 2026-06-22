import Image from "next/image";

export function Craftsmanship() {
	return (
		<section className="bg-[var(--ink)] text-[var(--cream)] overflow-hidden">
			<div className="grid grid-cols-1 lg:grid-cols-12">
				<div className="relative lg:col-span-7 aspect-[4/3] lg:aspect-auto lg:min-h-[560px]">
					<Image
						src="/scraped-2.jpg"
						alt="A heritage mattress workshop with rolls of ticking fabric and antique Singer sewing machines"
						fill
						sizes="(max-width: 1024px) 100vw, 58vw"
						className="object-cover grayscale-[0.05]"
					/>
					<div
						aria-hidden="true"
						className="absolute inset-0"
						style={{
							background: "linear-gradient(90deg, transparent 0%, transparent 65%, rgba(15,14,12,0.6) 100%)",
						}}
					/>
				</div>

				<div className="lg:col-span-5 flex items-center px-6 sm:px-12 lg:px-16 py-16 lg:py-24">
					<div className="max-w-md">
						<span className="heritage-smallcaps text-[var(--sand)]">The Workshop</span>
						<blockquote className="mt-6 font-display italic text-2xl sm:text-3xl lg:text-[2.1rem] leading-[1.2] tracking-tight text-[var(--cream)]">
							“A mattress should outlast the room it sleeps in. We measure ours not in seasons, but in the
							quiet of a thousand mornings.”
						</blockquote>
						<p className="mt-6 heritage-smallcaps text-[var(--cream)]/65">— Master Tufter, Bench No. 4</p>

						<div className="mt-10 grid grid-cols-3 gap-6 text-center">
							{[
								{ k: "121", l: "Hand-tied knots" },
								{ k: "14 lbs", l: "Wool & horsehair" },
								{ k: "1903", l: "Pattern of record" },
							].map((stat) => (
								<div key={stat.l} className="border-t border-[var(--cream)]/20 pt-4">
									<div className="font-display text-2xl tracking-tight text-[var(--cream)]">{stat.k}</div>
									<div className="mt-1 text-[10px] tracking-[0.18em] uppercase text-[var(--cream)]/55">
										{stat.l}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
