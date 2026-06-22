type Feature = {
	title: string;
	description: string;
};

type ProductFeaturesProps = {
	features?: Feature[];
};

const defaultFeatures: Feature[] = [
	{
		title: "Sourced Responsibly",
		description:
			"Materials selected from ateliers that meet our stringent environmental and ethical standards.",
	},
	{
		title: "Hand-finished",
		description: "Each garment is finished by hand — buttons stitched, seams pressed, edges hand-rolled.",
	},
	{
		title: "A Lifetime Guarantee",
		description: "Should anything fall short, return your piece for complimentary repair or replacement.",
	},
];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-24 border-t border-border pt-20">
			<p className="text-center text-[10px] tracking-[0.3em] uppercase text-muted-foreground">The standard</p>
			<h2 className="mt-4 text-center font-display text-4xl sm:text-5xl tracking-[-0.01em] text-foreground">
				Made to last lifetimes.
			</h2>
			<div className="mt-16 grid gap-12 md:grid-cols-3 max-w-5xl mx-auto">
				{features.map((feature, index) => (
					<div key={feature.title} className="text-center">
						<span className="font-display text-2xl text-[color:var(--champagne)]">
							{String(index + 1).padStart(2, "0")}
						</span>
						<div className="editorial-rule mt-3 mx-auto w-12" />
						<h3 className="mt-5 font-display text-xl text-foreground">{feature.title}</h3>
						<p className="mt-3 text-sm leading-relaxed text-muted-foreground max-w-xs mx-auto">
							{feature.description}
						</p>
					</div>
				))}
			</div>
		</section>
	);
}
