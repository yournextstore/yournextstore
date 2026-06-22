import type { LucideIcon } from "lucide-react";
import { Leaf, PackageCheck, Sprout } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Leaf, title: "Natural fibres", description: "Organic linen & silk" },
	{ icon: Sprout, title: "Small-batch", description: "Made in 12 ateliers" },
	{ icon: PackageCheck, title: "Carbon-mindful", description: "Shipped in paper" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-x-4 border-y border-border/70 py-5">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-start text-left">
					<badge.icon className="mb-2 h-4 w-4 text-foreground/70" />
					<span className="font-eyebrow text-[10px] text-foreground">{badge.title}</span>
					<span className="mt-1 text-[11px] text-muted-foreground">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
