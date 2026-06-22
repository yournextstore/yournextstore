import type { LucideIcon } from "lucide-react";
import { Coffee, Leaf, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free Shipping", description: "On 12-packs and up" },
	{ icon: Leaf, title: "Organic", description: "Certified ingredients" },
	{ icon: Coffee, title: "Fair Trade", description: "75mg of espresso" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 rounded-sm border border-border bg-secondary/60 p-5">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<badge.icon className="mb-2 h-5 w-5 text-terracotta" />
					<span className="text-xs font-medium text-espresso">{badge.title}</span>
					<span className="text-[10px] text-espresso/55">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
