import type { LucideIcon } from "lucide-react";
import { Package, RotateCcw, Shield, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free Shipping", description: "Orders over $300" },
	{ icon: Shield, title: "10-Year Warranty", description: "Full coverage" },
	{ icon: RotateCcw, title: "30-Day Returns", description: "Hassle-free" },
	{ icon: Package, title: "Made to Order", description: "Custom crafted" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-1 gap-3 border border-border/80 bg-background p-4 sm:grid-cols-2">
			{badges.map((badge) => (
				<div key={badge.title} className="flex items-start gap-3">
					<div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-border/80 bg-[var(--surface-soft)]">
						<badge.icon className="h-4 w-4 text-muted-foreground" />
					</div>
					<div>
						<span className="block text-sm font-medium">{badge.title}</span>
						<span className="text-xs text-muted-foreground">{badge.description}</span>
					</div>
				</div>
			))}
		</div>
	);
}
