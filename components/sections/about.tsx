export function About() {
	return (
		<section id="about" className="bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
					<div className="lg:col-span-6">
						<span className="inline-block text-[11px] tracking-[0.22em] uppercase font-semibold text-cobalt mb-6">
							— A note from the shelf
						</span>
						<h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95] font-black tracking-tight text-foreground">
							Ask.
							<br />
							<span className="italic font-light" style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}>
								Open.
							</span>
							<br />
							Discover.
						</h2>
					</div>
					<div className="lg:col-span-6 lg:pt-10">
						<p className="text-lg sm:text-xl text-foreground leading-relaxed">
							Your Next Store began as a tiny experiment: what if a shop could ask you something back? Every
							title, every object on these shelves is here because it nudges, prods, or quietly reframes the
							way you see.
						</p>
						<p className="mt-5 text-base text-muted-foreground leading-relaxed">
							Pull a question at random. Slide a book off the stack. Trust the shape of your curiosity —
							we&rsquo;ve made sure there are no wrong turns.
						</p>
						<div className="mt-8 flex items-center gap-4">
							<div className="w-10 h-px bg-ink/40" />
							<p
								className="font-display italic text-xl text-foreground"
								style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}
							>
								the YNS team
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
