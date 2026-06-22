import type { LucideIcon } from "lucide-react";
import { Leaf, Sprout, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free shipping", description: "Orders over $50" },
	{ icon: Leaf, title: "Plastic-free", description: "Compostable wrap" },
	{ icon: Sprout, title: "Small batch", description: "Made to order" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 rounded-2xl bg-sage-soft p-4 ring-1 ring-sage/20">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-sage">
						<badge.icon className="h-4 w-4" />
					</div>
					<span className="text-xs font-semibold text-ink">{badge.title}</span>
					<span className="text-[10px] text-ink/60 mt-0.5">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
