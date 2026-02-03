import { MaterialIcon } from "@/components/icons/material-icon";

const features = [
	{
		icon: "local_florist",
		title: "100% Natural",
		subtitle: "Organic Ingredients",
	},
	{
		icon: "science",
		title: "Lab Tested",
		subtitle: "Safety Guaranteed",
	},
	{
		icon: "verified_user",
		title: "Quality Check",
		subtitle: "Premium Standard",
	},
	{
		icon: "redeem",
		title: "Free Shipping",
		subtitle: "Orders over $40",
	},
];

export function FeatureStrip() {
	return (
		<div className="bg-dark-accent py-12 border-t border-border">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
				{features.map((feature) => (
					<div key={feature.title} className="flex items-center space-x-3 text-gray-300">
						<MaterialIcon name={feature.icon} className="text-primary text-3xl" />
						<div>
							<h4 className="text-white font-medium">{feature.title}</h4>
							<span className="text-xs">{feature.subtitle}</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
