import type { LucideIcon } from "lucide-react";
import { Flower2, Leaf, ShieldCheck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Leaf, title: "Plant-based", description: "Botanical formulas" },
	{ icon: Flower2, title: "Small-batch", description: "Steeped slowly" },
	{ icon: ShieldCheck, title: "30-day care", description: "Gentle returns" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 rounded-2xl bg-sand/70 p-4 ring-1 ring-cocoa/8">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center gap-1.5">
					<span className="flex h-8 w-8 items-center justify-center rounded-full bg-cream ring-1 ring-cocoa/10">
						<badge.icon className="h-4 w-4 text-terracotta" />
					</span>
					<span className="text-xs font-serif text-cocoa">{badge.title}</span>
					<span className="text-[10px] text-cocoa/60">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
