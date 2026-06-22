import { Headphones, RotateCcw, Shield, Truck } from "lucide-react";

const features = [
	{
		icon: Truck,
		title: "Free Shipping",
		description: "On orders over $500",
	},
	{
		icon: RotateCcw,
		title: "30-Day Returns",
		description: "Hassle-free returns",
	},
	{
		icon: Shield,
		title: "Secure Payment",
		description: "100% protected",
	},
	{
		icon: Headphones,
		title: "24/7 Support",
		description: "Expert assistance",
	},
];

export function ServiceFeatures() {
	return (
		<section className="bg-secondary border-y border-border">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
					{features.map((feature) => (
						<div key={feature.title} className="flex items-center gap-3">
							<div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
								<feature.icon className="w-5 h-5 text-primary" />
							</div>
							<div>
								<h4 className="text-sm font-semibold text-foreground">{feature.title}</h4>
								<p className="text-xs text-muted-foreground">{feature.description}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
