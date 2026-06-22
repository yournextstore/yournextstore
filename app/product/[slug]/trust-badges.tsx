import type { LucideIcon } from "lucide-react";
import { Flame, Leaf, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free Shipping", description: "Over $45" },
	{ icon: Leaf, title: "Clean Label", description: "9 ingredients or fewer" },
	{ icon: Flame, title: "Small Batch", description: "Bottled by hand" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-2 border border-[var(--brand-ink)]/10 bg-[var(--brand-cream)]/60 p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<badge.icon className="mb-3 h-5 w-5 text-[var(--brand-ember)]" strokeWidth={1.5} />
					<span className="font-mono-ed text-[10px] uppercase tracking-[0.18em] text-[var(--brand-ink)]">
						{badge.title}
					</span>
					<span className="mt-1 font-mono-ed text-[10px] text-[var(--brand-ink)]/55">
						{badge.description}
					</span>
				</div>
			))}
		</div>
	);
}
