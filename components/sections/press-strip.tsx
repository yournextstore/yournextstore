const quotes = [
	{ source: "Bon Appétit", line: '"A jar of pure mischief."' },
	{ source: "Eater", line: '"You will not be the same after this sauce."' },
	{ source: "Punch", line: '"Italian heritage with the safety off."' },
	{ source: "Saveur", line: '"It tastes like a dare and a hug."' },
];

export function PressStrip() {
	const items = [...quotes, ...quotes];
	return (
		<section className="relative bg-ember text-cream border-y-2 border-soot/20">
			<div aria-hidden className="absolute inset-0 flame-noise opacity-30 mix-blend-overlay" />
			<div className="relative overflow-hidden py-6">
				<div className="flex animate-marquee whitespace-nowrap gap-12">
					{items.map((q, i) => (
						<div key={`press-${i}`} className="inline-flex items-center gap-4 px-8">
							<span className="font-display text-3xl italic text-cream">{q.line}</span>
							<span aria-hidden className="text-gold">
								★
							</span>
							<span className="font-condensed text-xs tracking-[0.32em] text-gold/90">— {q.source}</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
