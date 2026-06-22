import type { LucideIcon } from "lucide-react";
import { Leaf, PackageOpen, Repeat } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Leaf, title: "Plant-derived", description: "96% biobased" },
	{ icon: PackageOpen, title: "Plastic-free", description: "Paper carton" },
	{ icon: Repeat, title: "Returns", description: "30 days, gladly" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-px bg-foreground/10 border border-foreground/10 overflow-hidden rounded-sm">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center bg-background py-5 px-3">
					<badge.icon className="mb-2 h-4 w-4 text-foreground/55" />
					<span className="text-[11px] uppercase tracking-[0.22em] text-foreground">{badge.title}</span>
					<span className="text-[10px] mt-1 font-serif italic text-foreground/55">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
