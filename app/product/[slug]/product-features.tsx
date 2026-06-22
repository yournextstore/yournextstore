type Feature = {
	title: string;
	description: string;
};

const defaultFeatures: Feature[] = [
	{
		title: "Made by hand",
		description: "Wheel-thrown, hand-loomed or carved in our Puglian atelier by a single maker.",
	},
	{
		title: "Low-impact materials",
		description: "Stone offcuts, undyed linen, unfired clay — sourced for how kindly they age.",
	},
	{
		title: "Lifetime repair",
		description: "Cracks, fraying, a chipped edge — we will mend it, for as long as you have it.",
	},
];

export function ProductFeatures({ features = defaultFeatures }: { features?: Feature[] }) {
	return (
		<section className="mt-24 border-t border-border pt-16">
			<div className="text-center max-w-xl mx-auto mb-12">
				<p className="text-[11px] uppercase tracking-[0.32em] text-clay/80 mb-3">Our practice</p>
				<h2 className="font-serif text-3xl sm:text-4xl text-walnut tracking-tight">
					Crafted with quiet intention
				</h2>
			</div>
			<div className="grid gap-10 md:grid-cols-3">
				{features.map((feature, i) => (
					<div key={feature.title} className="text-center px-4">
						<span className="font-serif text-3xl text-clay tabular-nums">0{i + 1}</span>
						<h3 className="mt-3 font-serif text-xl text-walnut">{feature.title}</h3>
						<p className="mt-3 text-sm text-espresso/65 leading-relaxed max-w-xs mx-auto">
							{feature.description}
						</p>
					</div>
				))}
			</div>
		</section>
	);
}
