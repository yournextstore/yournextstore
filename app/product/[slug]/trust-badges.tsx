import type { LucideIcon } from "lucide-react";
import { Clock, RotateCcw, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free Delivery", description: "On orders over $150" },
	{ icon: Clock, title: "Same Day Dispatch", description: "Before 4pm weekdays" },
	{ icon: RotateCcw, title: "30-Day Returns", description: "Free of charge" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-4 border border-border p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<badge.icon className="mb-2 h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
					<span className="text-xs font-medium">{badge.title}</span>
					<span className="text-[10px] text-muted-foreground">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
