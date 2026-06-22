import type { LucideIcon } from "lucide-react";
import { Leaf, Sparkles, Wheat } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Wheat, title: "Whole Grain", description: "Crispy base" },
	{ icon: Leaf, title: "Non-GMO", description: "Clean label" },
	{ icon: Sparkles, title: "7g Protein", description: "Per serving" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 rounded-2xl bg-[var(--lavender-soft)] p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<badge.icon className="mb-2 h-5 w-5 text-[var(--cobalt)]" />
					<span className="text-xs font-bold uppercase tracking-wide text-[var(--cobalt)]">
						{badge.title}
					</span>
					<span className="text-[10px] text-[var(--cobalt)]/65 mt-0.5">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
