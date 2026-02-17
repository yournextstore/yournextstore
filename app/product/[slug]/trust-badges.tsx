import type { LucideIcon } from "lucide-react";
import { Package, RotateCcw, Shield, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free Shipping", description: "Orders over $300" },
	{ icon: Shield, title: "10-Year Warranty", description: "Full coverage" },
	{ icon: RotateCcw, title: "30-Day Returns", description: "Hassle-free" },
	{ icon: Package, title: "Made to Order", description: "Custom crafted" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-2 gap-3 border border-border p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex items-center gap-3">
					<badge.icon className="h-4 w-4 text-muted-foreground shrink-0" />
					<div>
						<span className="text-xs font-medium block">{badge.title}</span>
						<span className="text-[10px] text-muted-foreground">{badge.description}</span>
					</div>
				</div>
			))}
		</div>
	);
}
