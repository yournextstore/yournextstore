import type { LucideIcon } from "lucide-react";
import { Leaf, Package, Sparkles, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free UK Shipping", description: "On orders over $75" },
	{ icon: Package, title: "Free Returns", description: "Within 60 days" },
	{ icon: Sparkles, title: "Studio-Designed", description: "Drawn in-house" },
	{ icon: Leaf, title: "Considered Fabrics", description: "Better-for-planet cottons" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-y border-border py-6">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center px-2">
					<badge.icon className="mb-3 h-5 w-5 text-forest" strokeWidth={1.5} />
					<span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-ink">
						{badge.title}
					</span>
					<span className="text-xs text-muted-foreground mt-1 font-light">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
