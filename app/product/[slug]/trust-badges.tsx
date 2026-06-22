import type { LucideIcon } from "lucide-react";
import { Flame, Leaf, ShieldCheck, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free shipping", description: "Orders $40+" },
	{ icon: Leaf, title: "Plant-based", description: "12g protein" },
	{ icon: Flame, title: "Small-batch", description: "Slow-glazed" },
	{ icon: ShieldCheck, title: "Snack guarantee", description: "Love it or refund" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-2xl border border-charcoal/10 bg-card p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center gap-1">
					<div className="mb-1 flex h-9 w-9 items-center justify-center rounded-full bg-chili/10 text-chili">
						<badge.icon className="h-4 w-4" />
					</div>
					<span className="font-display text-[11px] uppercase tracking-[0.16em] text-charcoal">
						{badge.title}
					</span>
					<span className="text-[10px] text-mahogany/70">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
