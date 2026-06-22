import type { LucideIcon } from "lucide-react";
import { Compass, Hammer, ShieldCheck, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Hammer, title: "Handfinished", description: "By the studio in Copenhagen" },
	{ icon: Truck, title: "White-glove delivery", description: "Crated and insured worldwide" },
	{ icon: ShieldCheck, title: "Lifetime warranty", description: "Original-owner coverage" },
	{ icon: Compass, title: "Considered returns", description: "30-day grace period" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 gap-px border-y border-foreground/15 bg-foreground/10">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col gap-2 p-5" style={{ backgroundColor: "#F4F1EC" }}>
					<badge.icon className="h-4 w-4 text-foreground/60" strokeWidth={1.5} />
					<div className="text-[11px] tracking-[0.22em] uppercase text-foreground">{badge.title}</div>
					<div className="text-xs text-foreground/60 leading-relaxed">{badge.description}</div>
				</div>
			))}
		</div>
	);
}
