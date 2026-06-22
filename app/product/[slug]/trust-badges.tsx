import type { LucideIcon } from "lucide-react";
import { Leaf, Microscope, ShieldCheck, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Microscope, title: "Lab Verified", description: "Clinically dosed actives" },
	{ icon: Leaf, title: "Botanical Grade", description: "Single-origin extracts" },
	{ icon: ShieldCheck, title: "Cruelty-Free", description: "Vegan certified" },
	{ icon: Truck, title: "Carbon-Neutral", description: "Shipped worldwide" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border/70 border border-border/70">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-start text-left p-4 bg-background gap-2">
					<badge.icon className="h-4 w-4 text-foreground" strokeWidth={1.4} />
					<span className="uppercase-display text-[10px] tracking-[0.18em] text-foreground">
						{badge.title}
					</span>
					<span className="text-[11px] text-muted-foreground leading-snug">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
