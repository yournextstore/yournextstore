const flavors = [
	{
		name: "Blood Orange",
		swatch: "#c0512b",
		notes: "Crimson citrus, dark cocoa, bright finish.",
	},
	{
		name: "Tangerine Chocolate",
		swatch: "#e8a66a",
		notes: "Toasted cacao, sun-ripe peel, soft cream.",
	},
	{
		name: "Grapefruit",
		swatch: "#d86a5c",
		notes: "Pink pith, mineral fizz, espresso warmth.",
	},
];

export function FlavorRow() {
	return (
		<section className="bg-cream-section pb-20 sm:pb-28">
			<div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8">
				{flavors.map((f) => (
					<div key={f.name} className="text-center">
						<div className="flex justify-center mb-6">
							<svg width="32" height="28" viewBox="0 0 32 28" aria-hidden="true">
								<polygon points="16,4 28,24 4,24" fill={f.swatch} />
							</svg>
						</div>
						<h3 className="font-display text-2xl text-espresso mb-3">{f.name}</h3>
						<p className="text-sm text-espresso/65 leading-relaxed max-w-[18rem] mx-auto">{f.notes}</p>
					</div>
				))}
			</div>
		</section>
	);
}
