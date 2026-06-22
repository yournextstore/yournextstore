import type { LucideIcon } from "lucide-react";
import { Leaf, RotateCcw, Truck, Waves } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free shipping", description: "On orders over $75" },
	{ icon: RotateCcw, title: "60-day returns", description: "Try it on the go" },
	{ icon: Leaf, title: "Recycled fabrics", description: "Built to last" },
	{ icon: Waves, title: "Coastal tested", description: "Sand, sweat, sun" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-y border-border py-5">
			{badges.map((badge) => (
				<div key={badge.title} className="flex items-center gap-3">
					<badge.icon className="h-5 w-5 text-[--oxblood] shrink-0" />
					<div className="leading-tight">
						<div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-foreground">
							{badge.title}
						</div>
						<div className="text-xs text-muted-foreground">{badge.description}</div>
					</div>
				</div>
			))}
		</div>
	);
}
