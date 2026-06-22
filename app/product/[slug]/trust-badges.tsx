import type { LucideIcon } from "lucide-react";
import { Flame, LeafyGreen, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free Shipping", description: "Orders over $50" },
	{ icon: Flame, title: "Small Batch", description: "Slow-simmered 12 hrs" },
	{ icon: LeafyGreen, title: "All Natural", description: "No preservatives" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 bg-secondary border border-soot/10 p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<badge.icon className="mb-2 h-5 w-5 text-ember" />
					<span className="font-condensed text-[11px] tracking-[0.18em] text-soot">{badge.title}</span>
					<span className="text-[10px] text-muted-foreground mt-1">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
