import type { LucideIcon } from "lucide-react";
import { Leaf, ThumbsUp, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Same-day delivery", description: "Order before 4pm" },
	{ icon: Leaf, title: "Farm fresh", description: "Picked at sunrise" },
	{ icon: ThumbsUp, title: "Freshness promise", description: "Or your money back" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-4 rounded-2xl bg-[var(--brand-soft)] p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<span className="mb-2 grid h-9 w-9 place-items-center rounded-full bg-white text-[var(--brand-deep)] shadow-soft">
						<badge.icon className="h-4 w-4" />
					</span>
					<span className="text-xs font-semibold text-[var(--brand-deep)]">{badge.title}</span>
					<span className="text-[10px] text-[var(--muted-foreground)]">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
