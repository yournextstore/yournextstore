import { Award, Package, Shield, Truck } from "lucide-react";

const features = [
	{
		icon: Truck,
		title: "Free Shipping",
		description: "Free shipping on all orders over $50",
		gradient: "from-primary to-primary/50",
	},
	{
		icon: Shield,
		title: "Secure Payment",
		description: "100% secure payment processing",
		gradient: "from-accent to-accent/50",
	},
	{
		icon: Package,
		title: "Easy Returns",
		description: "30-day hassle-free return policy",
		gradient: "from-destructive to-destructive/50",
	},
	{
		icon: Award,
		title: "Quality Guarantee",
		description: "Premium quality products guaranteed",
		gradient: "from-primary to-accent",
	},
] as const;

export function Features() {
	return (
		<section className="relative py-16 sm:py-20 overflow-hidden">
			{/* Background accent */}
			<div className="absolute inset-0 bg-secondary/50" />
			<div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
			<div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

			<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{features.map((feature) => (
						<div
							key={feature.title}
							className="group relative bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300"
						>
							{/* Icon with gradient background */}
							<div
								className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} mb-5 shadow-lg`}
							>
								<feature.icon className="h-6 w-6 text-white" />
							</div>

							<h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">
								{feature.title}
							</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>

							{/* Hover glow effect */}
							<div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
