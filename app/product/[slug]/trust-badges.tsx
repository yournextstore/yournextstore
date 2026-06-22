import type { LucideIcon } from "lucide-react";
import { Leaf, Sparkles, Wheat } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Leaf, title: "Plant-Based", description: "Always, never not" },
	{ icon: Sparkles, title: "Real Fruit", description: "Juice & purée" },
	{ icon: Wheat, title: "Gluten-Free", description: "Snack on, friend" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-4 rounded-2xl bg-[var(--lilac)]/15 p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<badge.icon className="mb-2 h-5 w-5 text-[var(--pink)]" />
					<span className="text-xs font-bold uppercase tracking-wider text-[var(--purple-deep)]">
						{badge.title}
					</span>
					<span className="text-[10px] text-[var(--purple-deep)]/60">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
