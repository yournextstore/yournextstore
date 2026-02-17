import { CreditCard, Gift, RotateCcw, Truck } from "lucide-react";

const features = [
	{
		icon: Truck,
		title: "FREE DELIVERY",
		description: "Worldwide from $75",
	},
	{
		icon: RotateCcw,
		title: "EASY RETURNS",
		description: "365 days for free returns",
	},
	{
		icon: CreditCard,
		title: "COMFORT PAYMENTS",
		description: "Credit Cards Available",
	},
	{
		icon: Gift,
		title: "FREE GIFTS",
		description: "Get gifts and discounts",
	},
];

export function TrustBar() {
	return (
		<section className="border-y border-border bg-secondary/50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
					{features.map((feature) => (
						<div key={feature.title} className="flex items-center gap-3">
							<div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-brand text-brand-foreground">
								<feature.icon className="w-5 h-5" />
							</div>
							<div>
								<h4 className="font-heading text-xs font-bold uppercase tracking-wide">{feature.title}</h4>
								<p className="text-xs text-muted-foreground">{feature.description}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
