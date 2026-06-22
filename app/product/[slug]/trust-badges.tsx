import type { LucideIcon } from "lucide-react";
import { Leaf, Sparkles, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free Shipping", description: "Orders over $80" },
	{ icon: Leaf, title: "100% Plant-based", description: "Always & forever" },
	{ icon: Sparkles, title: "Real Ingredients", description: "No hidden sugars" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 rounded-2xl bg-brand-cream p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-coral">
						<badge.icon className="h-4 w-4" />
					</div>
					<span className="text-xs font-semibold text-brand-ink">{badge.title}</span>
					<span className="text-[10px] text-brand-ink/60">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
