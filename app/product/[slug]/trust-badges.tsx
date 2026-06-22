import type { LucideIcon } from "lucide-react";
import { Heart, Leaf, RotateCcw, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free Shipping", description: "Orders over $60" },
	{ icon: Leaf, title: "Cruelty-Free", description: "Leaping Bunny certified" },
	{ icon: Heart, title: "Made With Love", description: "Clean, vegan formulas" },
	{ icon: RotateCcw, title: "30-Day Returns", description: "Send-back, no fuss" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[color:var(--yns-ink)]/10 border border-[color:var(--yns-ink)]/10">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center bg-white p-4 gap-1">
					<badge.icon className="mb-1 h-5 w-5 text-[color:var(--yns-red)]" strokeWidth={1.5} />
					<span className="text-[11px] font-extrabold tracking-[0.14em] uppercase text-[color:var(--yns-ink)]">
						{badge.title}
					</span>
					<span className="text-[11px] text-[color:var(--yns-ink)]/60">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
