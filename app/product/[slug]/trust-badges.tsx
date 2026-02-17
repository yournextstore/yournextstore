import type { LucideIcon } from "lucide-react";
import { Package, RotateCcw, Shield, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free Shipping", description: "Orders over $100" },
	{ icon: RotateCcw, title: "30-Day Returns", description: "Postage paid" },
	{ icon: Shield, title: "2-Year Warranty", description: "Full coverage" },
	{ icon: Package, title: "Secure Packaging", description: "Gift ready" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-2 gap-4 border-t border-border pt-6">
			{badges.map((badge) => (
				<div key={badge.title} className="flex items-start gap-3">
					<badge.icon className="mt-0.5 h-4 w-4 text-accent shrink-0" />
					<div>
						<span className="text-xs font-medium text-foreground">{badge.title}</span>
						<span className="block text-[11px] text-muted-foreground">{badge.description}</span>
					</div>
				</div>
			))}
		</div>
	);
}
