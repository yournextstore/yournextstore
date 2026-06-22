import type { LucideIcon } from "lucide-react";
import { Droplets, Leaf, Sparkles } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Droplets, title: "Free samples", description: "With every order $30+" },
	{ icon: Leaf, title: "Cruelty-free", description: "Vegan & IFRA-compliant" },
	{ icon: Sparkles, title: "Hand-poured", description: "Grasse, France · Batch 19" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-4 border border-foreground/10 bg-secondary/30 p-5">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<badge.icon className="mb-3 h-4 w-4 text-saffron" />
					<span className="text-[10px] tracking-microcaps text-foreground/85">{badge.title}</span>
					<span className="mt-1 text-[10px] text-foreground/45">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
