import { CreditCard, Headphones, ShieldCheck, Truck } from "lucide-react";

const benefits = [
	{ icon: Truck, title: "Free Shipping", description: "On orders over $200" },
	{ icon: ShieldCheck, title: "Money Guarantee", description: "Return within 7 days" },
	{ icon: CreditCard, title: "Flexible Payment", description: "Pay with ease" },
	{ icon: Headphones, title: "Online Support", description: "24/7 customer service" },
];

export function BenefitsBar() {
	return (
		<section className="border-y border-border bg-secondary/30">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
					{benefits.map((benefit) => (
						<div key={benefit.title} className="flex items-start gap-3">
							<benefit.icon className="w-6 h-6 text-accent shrink-0 mt-0.5" />
							<div>
								<p className="text-sm font-semibold text-foreground">{benefit.title}</p>
								<p className="text-xs text-muted-foreground mt-0.5">{benefit.description}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
