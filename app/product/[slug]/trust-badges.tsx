import type { LucideIcon } from "lucide-react";
import { Leaf, RotateCcw, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free Shipping", description: "Orders over $75" },
	{ icon: Leaf, title: "Salon-Grade", description: "Vegan + cruelty-free" },
	{ icon: RotateCcw, title: "30-Day Returns", description: "Love it or send it back" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-4 rounded-[20px] border border-yns-pink-soft bg-yns-pink-soft/30 p-5">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-yns-pink">
						<badge.icon className="h-4 w-4 text-yns-ink" strokeWidth={1.6} />
					</div>
					<span className="text-[11px] tracking-[0.14em] uppercase font-bold text-yns-ink">
						{badge.title}
					</span>
					<span className="text-[10px] text-yns-ink/60 mt-1">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
