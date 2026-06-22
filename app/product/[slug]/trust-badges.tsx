import type { LucideIcon } from "lucide-react";
import { Leaf, Snowflake, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Fast Cold Shipping", description: "Orders ship next day" },
	{ icon: Snowflake, title: "Crisp Guarantee", description: "Fresh or your money back" },
	{ icon: Leaf, title: "Real Ingredients", description: "No artificial junk, ever" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 rounded-2xl bg-[var(--peach-light)] p-4 border border-[var(--peach)]/60">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<badge.icon className="mb-2 h-5 w-5 text-[var(--coral)]" />
					<span className="text-xs font-semibold text-[var(--ink)]">{badge.title}</span>
					<span className="text-[10px] text-[var(--ink)]/55 mt-0.5">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
