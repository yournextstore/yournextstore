import type { LucideIcon } from "lucide-react";
import { Leaf, Sparkles, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free shipping", description: "On orders over $80" },
	{ icon: Sparkles, title: "BPA-free", description: "Food-safe materials" },
	{ icon: Leaf, title: "Designed in Denmark", description: "Slow, considered" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-px bg-[var(--border)] rounded-sm overflow-hidden">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center bg-[var(--cream)] px-3 py-5">
					<badge.icon className="mb-3 h-5 w-5 text-[var(--olive-dark)]" strokeWidth={1.4} />
					<span className="text-[11px] font-medium tracking-wide text-foreground">{badge.title}</span>
					<span className="text-[10px] tracking-[0.14em] uppercase text-foreground/55 mt-1">
						{badge.description}
					</span>
				</div>
			))}
		</div>
	);
}
