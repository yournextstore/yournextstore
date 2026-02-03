type Feature = {
	title: string;
	description: string;
};

type ProductFeaturesProps = {
	features?: Feature[];
};

const defaultFeatures: Feature[] = [
	{
		title: "Sustainable Materials",
		description: "Crafted from responsibly sourced materials with minimal environmental impact.",
	},
	{
		title: "Expert Craftsmanship",
		description: "Each piece is carefully made by skilled artisans with attention to detail.",
	},
	{
		title: "Quality Guaranteed",
		description: "Built to last with premium components and rigorous quality standards.",
	},
];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-24 lg:mt-32">
			{/* Top border */}
			<div className="h-px w-full bg-zinc-200 mb-16" />

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
				{/* Section title */}
				<div className="lg:col-span-4">
					<p className="text-xs tracking-[0.3em] uppercase text-zinc-400 mb-4">
						Details
					</p>
					<h2 className="text-2xl lg:text-3xl font-light tracking-[-0.02em] text-zinc-900">
						Crafted with intention
					</h2>
				</div>

				{/* Features list */}
				<div className="lg:col-span-8">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
						{features.map((feature, index) => (
							<div key={feature.title}>
								<p className="text-xs tracking-[0.2em] uppercase text-zinc-400 mb-4">
									{String(index + 1).padStart(2, "0")}
								</p>
								<h3 className="text-base font-light text-zinc-900 mb-3">
									{feature.title}
								</h3>
								<p className="text-sm text-zinc-500 leading-relaxed font-light">
									{feature.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
