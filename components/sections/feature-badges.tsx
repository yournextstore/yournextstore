import { Clock, RotateCcw, Truck } from "lucide-react";

const features = [
	{
		icon: Truck,
		title: "Free & Fast Delivery",
		description: "A free fully trackable 2 day delivery service on all orders over $150. Guaranteed!",
	},
	{
		icon: Clock,
		title: "Same Day Dispatch",
		description: "All orders placed before 4pm Monday to Friday are dispatched the same day.",
	},
	{
		icon: RotateCcw,
		title: "Exchanges & Returns",
		description: "You have 30 days from the shipping date to return your purchase FREE OF CHARGE.",
	},
];

export function FeatureBadges() {
	return (
		<section className="border-t border-b border-border">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
					{features.map((feature) => (
						<div key={feature.title} className="text-center">
							<feature.icon className="w-7 h-7 mx-auto mb-4 text-foreground" strokeWidth={1.5} />
							<h3 className="text-sm font-semibold uppercase tracking-wide mb-2">{feature.title}</h3>
							<p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
