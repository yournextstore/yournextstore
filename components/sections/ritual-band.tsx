const steps = [
	{
		number: "01",
		title: "Pour",
		copy: "Stir one teaspoon into a small glass of cool water about thirty minutes before bed.",
	},
	{
		number: "02",
		title: "Pause",
		copy: "Set down your phone. Pick up a book, dim the lamp, let the body downshift.",
	},
	{
		number: "03",
		title: "Rest",
		copy: "Fall asleep faster, stay asleep longer, and wake without grogginess by morning.",
	},
];

export function RitualBand() {
	return (
		<section className="bg-cream">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="text-center max-w-xl mx-auto mb-14">
					<p className="text-[10px] tracking-[0.32em] uppercase text-primary mb-4">— The ritual —</p>
					<h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-[1.1] text-foreground">
						Three steps to a softer night.
					</h2>
				</div>
				<div className="grid gap-12 md:grid-cols-3">
					{steps.map((step) => (
						<div key={step.number} className="relative">
							<div className="font-serif text-5xl text-primary/80 mb-4 leading-none">{step.number}</div>
							<div className="h-px w-12 bg-primary/40 mb-5" />
							<h3 className="font-serif text-2xl text-foreground mb-3">{step.title}</h3>
							<p className="text-sm leading-relaxed text-muted-foreground max-w-sm">{step.copy}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
