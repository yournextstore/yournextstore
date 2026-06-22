import Image from "next/image";

export function Results() {
	return (
		<section className="bg-white">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-28">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
					{/* Side-by-side imagery */}
					<div className="lg:col-span-7 grid grid-cols-2 gap-3">
						<figure className="relative aspect-[3/4] overflow-hidden bg-[color:var(--yns-cream)]">
							<Image
								src="/scraped-1.jpg"
								alt="Before — dry, frizzy hair"
								fill
								sizes="(max-width: 1024px) 50vw, 33vw"
								className="object-cover"
							/>
							<figcaption className="absolute top-4 left-4 bg-white px-3 py-1 text-[11px] font-extrabold tracking-[0.18em] uppercase text-[color:var(--yns-ink)]">
								Before
							</figcaption>
						</figure>
						<figure className="relative aspect-[3/4] overflow-hidden bg-[color:var(--yns-cream)]">
							<Image
								src="/scraped-2.jpg"
								alt="After — silky, hydrated hair"
								fill
								sizes="(max-width: 1024px) 50vw, 33vw"
								className="object-cover"
							/>
							<figcaption className="absolute top-4 left-4 bg-[color:var(--yns-red)] px-3 py-1 text-[11px] font-extrabold tracking-[0.18em] uppercase text-white">
								After
							</figcaption>
						</figure>
					</div>

					{/* Quote */}
					<div className="lg:col-span-5 relative">
						<span className="absolute -top-12 -left-2 font-display text-[180px] leading-none text-[color:var(--yns-pink)]/30 select-none">
							&ldquo;
						</span>
						<span className="font-script text-3xl text-[color:var(--yns-red)] relative">real results</span>
						<blockquote className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight leading-[1.05] text-[color:var(--yns-ink)] relative">
							One spritz and my curls behaved for the first time in years.
						</blockquote>
						<div className="mt-8 flex items-center gap-4 relative">
							<div className="flex">
								{[0, 1, 2, 3, 4].map((i) => (
									<svg
										key={i}
										className="w-5 h-5 fill-[color:var(--yns-red)]"
										viewBox="0 0 20 20"
										aria-hidden="true"
									>
										<path d="M10 1l2.6 5.3 5.9.9-4.3 4.2 1 5.8L10 14.5 4.7 17.2l1-5.8L1.5 7.2l5.9-.9z" />
									</svg>
								))}
							</div>
							<p className="text-sm font-bold tracking-wide uppercase text-[color:var(--yns-ink)]">
								Maya R. — verified buyer
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
