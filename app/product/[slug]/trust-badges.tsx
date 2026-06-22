import type { LucideIcon } from "lucide-react";
import { Leaf, Sprout, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free Delivery", description: "Orders over $100" },
	{ icon: Sprout, title: "USDA Organic", description: "Certified growers" },
	{ icon: Leaf, title: "Farm Fresh", description: "Picked within 24h" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 rounded-2xl bg-cream p-4 border border-border">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<span className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-lime/30 text-forest-deep">
						<badge.icon className="h-4 w-4" />
					</span>
					<span className="text-xs font-semibold text-forest-deep">{badge.title}</span>
					<span className="text-[10px] text-muted-foreground">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
