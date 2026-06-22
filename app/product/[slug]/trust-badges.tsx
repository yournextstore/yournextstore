import type { LucideIcon } from "lucide-react";
import { Heart, Leaf, RotateCcw, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free shipping", description: "On orders over $75" },
	{ icon: RotateCcw, title: "30-night promise", description: "Love it or return it" },
	{ icon: Leaf, title: "Mulberry silk", description: "6A-grade, OEKO-TEX®" },
	{ icon: Heart, title: "Made slowly", description: "Small-batch atelier" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-y border-walnut/15 py-5">
			{badges.map((badge) => (
				<div key={badge.title} className="flex items-center gap-3">
					<badge.icon className="h-5 w-5 text-terracotta shrink-0" strokeWidth={1.5} />
					<div className="flex flex-col">
						<span className="text-xs font-medium text-espresso tracking-wide">{badge.title}</span>
						<span className="text-[11px] text-walnut/60">{badge.description}</span>
					</div>
				</div>
			))}
		</div>
	);
}
