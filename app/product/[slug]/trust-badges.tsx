import type { LucideIcon } from "lucide-react";
import { Leaf, Package, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Insured Shipping", description: "Free over $150" },
	{ icon: Package, title: "Wrapped By Hand", description: "Recycled fiber" },
	{ icon: Leaf, title: "30-Day Returns", description: "No questions asked" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-4 rounded-2xl border border-border bg-[var(--sand)]/40 p-5">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<badge.icon className="mb-2 h-5 w-5 text-[var(--mahogany)]" />
					<span className="text-xs font-medium tracking-wide text-foreground">{badge.title}</span>
					<span className="text-[10px] text-muted-foreground mt-0.5">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
