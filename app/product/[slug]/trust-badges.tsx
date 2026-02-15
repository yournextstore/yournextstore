import type { LucideIcon } from "lucide-react";
import { Award, RotateCcw, Shield, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free Shipping", description: "Orders over $500" },
	{ icon: Shield, title: "Manufacturer Warranty", description: "OEM guaranteed" },
	{ icon: RotateCcw, title: "30-Day Returns", description: "Easy returns" },
	{ icon: Award, title: "Genuine Parts", description: "100% authentic" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-lg bg-secondary p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mb-2">
						<badge.icon className="h-4 w-4 text-primary" />
					</div>
					<span className="text-xs font-semibold text-foreground">{badge.title}</span>
					<span className="text-[10px] text-muted-foreground">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
