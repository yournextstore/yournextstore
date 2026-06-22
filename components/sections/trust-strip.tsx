import { CreditCard, Headphones, RotateCcw, Truck } from "lucide-react";

const badges = [
	{ icon: Truck, label: "Free Shipping" },
	{ icon: RotateCcw, label: "Money Guarantee" },
	{ icon: CreditCard, label: "Flexible Payment" },
	{ icon: Headphones, label: "Online Support" },
];

export function TrustStrip() {
	return (
		<section className="border-y border-border bg-secondary/30">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
					{badges.map((badge) => (
						<div key={badge.label} className="flex items-center gap-3">
							<badge.icon className="h-5 w-5 text-primary shrink-0" strokeWidth={1.5} />
							<span className="text-xs font-medium tracking-wide uppercase">{badge.label}</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
