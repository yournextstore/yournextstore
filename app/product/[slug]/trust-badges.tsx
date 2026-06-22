import type { LucideIcon } from "lucide-react";
import { Gift, Heart, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free shipping", description: "On orders over $49" },
	{ icon: Gift, title: "Gift-ready", description: "Hand-written note included" },
	{ icon: Heart, title: "Baked to order", description: "Always fresh, never frozen" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 rounded-2xl bg-[var(--cream)] p-5 ring-1 ring-[var(--border)]">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<badge.icon className="mb-2 h-5 w-5 text-[var(--candy)]" />
					<span className="text-[11px] font-bold tracking-wider uppercase text-[var(--maroon)]">
						{badge.title}
					</span>
					<span className="text-[10px] text-[var(--ink)]/60 mt-0.5">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
