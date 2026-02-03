import { MaterialIcon } from "@/components/icons/material-icon";

type Feature = {
	title: string;
	description: string;
	icon: string;
};

type ProductFeaturesProps = {
	features?: Feature[];
};

const defaultFeatures: Feature[] = [
	{
		title: "100% Organic",
		description: "Sourced from organically grown hemp with no synthetic additives or harmful chemicals.",
		icon: "local_florist",
	},
	{
		title: "Lab Tested",
		description: "Every batch is rigorously third-party lab tested for potency and purity you can trust.",
		icon: "science",
	},
	{
		title: "Premium Quality",
		description: "Full spectrum of beneficial cannabinoids and terpenes preserved from seed to shelf.",
		icon: "verified_user",
	},
];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-border pt-16">
			<h2 className="mb-12 text-center text-3xl font-bold text-white">Why Choose Cannabo</h2>
			<div className="grid gap-8 md:grid-cols-3">
				{features.map((feature) => (
					<div key={feature.title} className="group flex flex-col items-center text-center">
						<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-dark-accent transition-colors group-hover:bg-primary">
							<MaterialIcon
								name={feature.icon}
								className="text-3xl text-primary transition-colors group-hover:text-white"
							/>
						</div>
						<h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
						<p className="text-sm text-gray-400">{feature.description}</p>
					</div>
				))}
			</div>
		</section>
	);
}
