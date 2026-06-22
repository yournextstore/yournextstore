import type { LucideIcon } from "lucide-react";
import { Leaf, Sparkles, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free shipping", description: "On orders over $60" },
	{ icon: Leaf, title: "7 ingredients", description: "No funny business" },
	{ icon: Sparkles, title: "Bakery fresh", description: "Slow-baked in small batches" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-2 sm:gap-4 border border-foreground/10 bg-[var(--cream)] p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<badge.icon className="mb-2 h-5 w-5 text-[var(--crimson)]" />
					<span className="text-xs font-semibold tracking-wide">{badge.title}</span>
					<span className="text-[10px] text-muted-foreground mt-0.5">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
