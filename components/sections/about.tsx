import Image from "next/image";

export function About() {
	return (
		<section id="about" className="relative bg-cream py-16 sm:py-24 overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid lg:grid-cols-12 gap-12 items-center">
					<div className="lg:col-span-5 order-2 lg:order-1">
						<div className="relative">
							<div className="relative aspect-[4/5] w-full max-w-md rounded-[2rem] overflow-hidden border-4 border-card shadow-[0_20px_60px_rgba(58,26,18,0.18)] -rotate-2">
								<Image
									src="/scraped-3.jpg"
									alt="Behind the scenes"
									fill
									sizes="(max-width: 1024px) 90vw, 40vw"
									className="object-cover"
								/>
							</div>
							<div className="absolute -bottom-6 -right-2 sm:right-12 rotate-6 rounded-2xl bg-chili text-cream px-5 py-3 shadow-[0_10px_30px_rgba(217,67,39,0.35)]">
								<p className="font-display text-xs uppercase tracking-[0.2em]">Made in</p>
								<p className="font-display text-xl font-extrabold">Brooklyn, NY</p>
							</div>
						</div>
					</div>

					<div className="lg:col-span-7 order-1 lg:order-2">
						<p className="font-display text-[11px] tracking-[0.32em] uppercase text-chili">Our story</p>
						<h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase text-charcoal leading-[1.05]">
							We grew up sneaking snacks. Now we make them.
						</h2>
						<div className="mt-6 grid sm:grid-cols-2 gap-6 text-mahogany/85 leading-relaxed">
							<p>
								Your Next Store started with a question: why is every &ldquo;healthy&rdquo; snack either
								chalky, sweet, or pretending to be a granola bar? We wanted something{" "}
								<em className="font-script">savory</em>, portable, and built around protein you can actually
								pronounce.
							</p>
							<p>
								We marinate organic tofu in small batches, slow-glaze it until the edges crisp, and seal it in
								a pouch that fits a pocket. No additives, no preachy mission slogans. Just snacks we&apos;d
								eat at our own desks.
							</p>
						</div>

						<dl className="mt-10 grid grid-cols-3 gap-4 sm:gap-6">
							{[
								{ stat: "12g", label: "Plant Protein" },
								{ stat: "5", label: "Flavors strong" },
								{ stat: "100%", label: "Soy-glazed joy" },
							].map((s) => (
								<div
									key={s.label}
									className="rounded-2xl border border-charcoal/10 bg-card p-4 sm:p-5 text-center"
								>
									<dt className="font-display text-3xl sm:text-4xl font-extrabold text-chili">{s.stat}</dt>
									<dd className="mt-1 text-[11px] uppercase tracking-[0.18em] font-semibold text-mahogany/80">
										{s.label}
									</dd>
								</div>
							))}
						</dl>
					</div>
				</div>
			</div>
		</section>
	);
}
