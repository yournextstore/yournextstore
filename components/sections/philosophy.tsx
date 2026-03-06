export function Philosophy() {
	return (
		<section
			id="philosophy"
			className="py-32 px-6 md:px-12 w-full bg-card relative overflow-hidden scroll-mt-24"
		>
			{/* Decorative blur */}
			<div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

			<div className="max-w-6xl mx-auto relative z-10">
				{/* Section header */}
				<div className="text-center mb-16">
					<h2 className="font-display text-5xl md:text-7xl mb-6 text-foreground">
						The <span className="italic text-primary">Skinclean</span> Philosophy
					</h2>
					<div className="w-24 h-px bg-primary mx-auto" />
				</div>

				{/* Two-column text */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 text-lg leading-relaxed font-light text-muted-foreground">
					<div>
						<p className="mb-6 first-letter:text-5xl first-letter:font-display first-letter:mr-2 first-letter:float-left first-letter:text-primary first-letter:leading-none">
							We believe that true beauty stems from health, and health is born from nature refined by
							science. At Skinclean, our commitment goes beyond the surface. We meticulously source organic
							botanicals from sustainable farms, ensuring that every ingredient tells a story of purity and
							potency.
						</p>
						<p>
							Our laboratories are where tradition meets innovation. By utilizing cold-press extraction and
							bio-fermentation, we preserve the vital nutrients of our raw ingredients, delivering them
							directly to your skin without harsh preservatives or fillers.
						</p>
					</div>

					<div className="flex flex-col justify-between">
						<p className="mb-6">
							Transparency is at the core of our ethos. We formulate for the modern individual who seeks
							efficacy without compromise. Our &ldquo;Clean Clinical&rdquo; approach means rigorous testing
							for safety and performance, ensuring that our high-tech solutions respect your skin&apos;s
							natural microbiome.
						</p>
						<div>
							<blockquote className="font-display text-2xl italic text-foreground mb-4">
								&ldquo;Skincare is not a routine, it is a ritual of self-respect.&rdquo;
							</blockquote>
							<cite className="text-sm font-medium uppercase tracking-widest not-italic text-primary">
								&mdash; Founder
							</cite>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
