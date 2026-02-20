import { Package, RotateCcw, Truck } from "lucide-react";

const infoItems = [
	{
		icon: Truck,
		title: "Shipping",
		description: "Free shipping on all orders over $100. Fast and reliable delivery worldwide.",
	},
	{
		icon: Package,
		title: "Delivery",
		description: "We offer free delivery for certain types of orders. Check our offers page for details.",
	},
	{
		icon: RotateCcw,
		title: "Returns",
		description: "14 days to test our products. Hassle-free returns with full refund guarantee.",
	},
];

export function InfoColumns() {
	return (
		<section className="border-t border-border py-16 sm:py-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
					{infoItems.map((item) => (
						<div key={item.title} className="text-center">
							<item.icon className="w-6 h-6 mx-auto mb-4 text-muted-foreground" strokeWidth={1.5} />
							<h3 className="font-heading text-lg font-light tracking-wider uppercase mb-3">{item.title}</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
