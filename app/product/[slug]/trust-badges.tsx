import type { LucideIcon } from "lucide-react";
import { Feather, Leaf, Sparkles } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Leaf, title: "Small Batch", description: "Pressed monthly" },
	{ icon: Feather, title: "Botanical", description: "Plant-forward" },
	{ icon: Sparkles, title: "Cruelty-Free", description: "Always & only" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-4 border-y border-ink/15 py-6">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<badge.icon className="mb-2 h-5 w-5 text-rosewood" strokeWidth={1.3} />
					<span className="eyebrow text-ink text-[0.65rem]">{badge.title}</span>
					<span className="mt-1 font-serif italic text-ink/60 text-sm">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
