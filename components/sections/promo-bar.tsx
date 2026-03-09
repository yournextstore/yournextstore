import { Leaf, Package, Truck } from "lucide-react";

const promos = [
	{ icon: Truck, label: "Free shipping" },
	{ icon: Leaf, label: "Sustainable materials" },
	{ icon: Package, label: "Locally made" },
];

export function PromoBar() {
	return (
		<section className="border-t border-b border-border bg-secondary">
			<div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
				<div className="flex items-center justify-center gap-10 sm:gap-16 flex-wrap">
					{promos.map((promo) => (
						<div key={promo.label} className="flex items-center gap-2.5">
							<promo.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
							<span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{promo.label}</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
