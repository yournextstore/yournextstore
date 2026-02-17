import { Gift, MapPin, Truck } from "lucide-react";

const promos = [
	{ icon: Gift, text: "Personalized gift packaging" },
	{ icon: MapPin, text: "In Store Pickup" },
	{ icon: Truck, text: "2-days Shipping" },
];

export function PromoBar() {
	return (
		<section className="bg-cream border-y border-border py-6">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-wrap justify-center gap-8 sm:gap-16">
					{promos.map((promo) => (
						<div key={promo.text} className="flex items-center gap-3 text-foreground">
							<promo.icon className="h-5 w-5 text-muted-foreground" />
							<span className="text-sm">{promo.text}</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
