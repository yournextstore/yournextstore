import type { LucideIcon } from "lucide-react";
import { Heart, RotateCcw, Sparkles, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free Shipping", description: "Orders over $50" },
	{ icon: Sparkles, title: "Hand-Packed", description: "Lovingly assembled" },
	{ icon: Heart, title: "Small-Batch", description: "Made in tiny runs" },
	{ icon: RotateCcw, title: "Easy Returns", description: "30 days, no fuss" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-2xl bg-[var(--cream)] p-5 border border-[var(--pink)]/15">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<badge.icon className="mb-2 h-5 w-5 text-[var(--pink)]" />
					<span className="text-xs font-display uppercase tracking-wider text-[var(--burgundy)]">
						{badge.title}
					</span>
					<span className="text-[10px] text-[var(--burgundy)]/60 mt-1">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
