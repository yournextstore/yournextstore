import type { LucideIcon } from "lucide-react";
import { Recycle, Ruler, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Complimentary Shipping", description: "On orders over $150" },
	{ icon: Recycle, title: "Free Returns", description: "Within 30 days" },
	{ icon: Ruler, title: "Fit Specialists", description: "Chat with our atelier" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 border-y border-border py-5">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<badge.icon className="mb-2 h-4 w-4 text-mushroom" strokeWidth={1.4} />
					<span className="utility-caps text-foreground">{badge.title}</span>
					<span className="mt-1 text-[11px] text-mushroom">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
