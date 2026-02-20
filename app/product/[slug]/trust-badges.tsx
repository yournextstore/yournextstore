import type { LucideIcon } from "lucide-react";
import { Leaf, RotateCcw, Shield, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free Shipping", description: "Orders over $200" },
	{ icon: Leaf, title: "100% Natural", description: "Certified organic" },
	{ icon: Shield, title: "Quality Tested", description: "Lab verified" },
	{ icon: RotateCcw, title: "Easy Returns", description: "30-day policy" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
			{badges.map((badge) => (
				<div
					key={badge.title}
					className="flex flex-col items-center text-center p-3 rounded-lg bg-primary/5 border border-primary/10"
				>
					<badge.icon className="mb-2 h-5 w-5 text-primary" />
					<span className="text-xs font-semibold text-foreground">{badge.title}</span>
					<span className="text-[10px] text-muted-foreground">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
