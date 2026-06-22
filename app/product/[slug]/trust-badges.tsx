import type { LucideIcon } from "lucide-react";
import { Leaf, RotateCcw, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free shipping", description: "Orders over $50" },
	{ icon: Leaf, title: "Bean-to-bar", description: "Single-origin cocoa" },
	{ icon: RotateCcw, title: "Happiness promise", description: "30-day returns" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 rounded-md border-2 border-yns-cocoa/15 bg-white p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center gap-1.5">
					<badge.icon className="h-5 w-5 text-yns-green" strokeWidth={2.25} />
					<span className="text-[11px] font-extrabold uppercase tracking-wider text-yns-cocoa">
						{badge.title}
					</span>
					<span className="text-[10px] text-yns-cocoa/60">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
