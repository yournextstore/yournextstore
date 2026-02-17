import type { LucideIcon } from "lucide-react";
import { RotateCcw, Shield, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free Shipping", description: "On orders over $100" },
	{ icon: Shield, title: "Secure Payment", description: "100% protected" },
	{ icon: RotateCcw, title: "Easy Returns", description: "30-day policy" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-4 border border-border p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<badge.icon className="mb-2 h-4 w-4 text-foreground/40" />
					<span className="text-[10px] font-medium uppercase tracking-wider">{badge.title}</span>
					<span className="text-[10px] text-foreground/40">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
