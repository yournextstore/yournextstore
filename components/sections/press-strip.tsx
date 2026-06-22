const quotes = [
	{ source: "The Paris Review", text: "A pocket oracle disguised as a bookshop." },
	{ source: "Kinfolk", text: "Quietly subversive. Loudly beautiful." },
	{ source: "Vicki Tan", text: "The kind of shelf I’d build if I had the patience." },
	{ source: "It’s Nice That", text: "Editorial design at its most generous." },
	{ source: "Monocle", text: "A new model for what an independent shop can feel like." },
	{ source: "Creative Review", text: "Half library, half love letter." },
];

export function PressStrip() {
	const loop = [...quotes, ...quotes];
	return (
		<section className="bg-cream-dark border-y-2 border-ink overflow-hidden">
			<div className="py-6 sm:py-8">
				<div className="marquee">
					{loop.map((q, i) => (
						<div key={`${q.source}-${i}`} className="flex items-center gap-6 whitespace-nowrap">
							<span
								className="font-display italic text-xl sm:text-2xl text-foreground"
								style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}
							>
								“{q.text}”
							</span>
							<span className="text-xs tracking-[0.22em] uppercase font-semibold text-cobalt">
								— {q.source}
							</span>
							<span className="text-cobalt text-xl">✦</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
