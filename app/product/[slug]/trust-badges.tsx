import type { LucideIcon } from "lucide-react";
import { Flame, Leaf, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free Shipping", description: "Orders over $50" },
	{ icon: Leaf, title: "All Natural", description: "No fake stuff" },
	{ icon: Flame, title: "Small Batch", description: "Made with love" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-4 rounded-md bg-secondary p-4 border-[2px] border-foreground">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<badge.icon className="mb-2 h-5 w-5 text-[#ff2524]" />
					<span className="text-xs font-bold uppercase">{badge.title}</span>
					<span className="text-[10px] text-muted-foreground">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
