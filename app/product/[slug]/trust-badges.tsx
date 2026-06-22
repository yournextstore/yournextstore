import type { LucideIcon } from "lucide-react";
import { Leaf, ShieldCheck, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free shipping", description: "Orders over $60" },
	{ icon: Leaf, title: "Grass-fed", description: "Pasture-raised cream" },
	{ icon: ShieldCheck, title: "Small batch", description: "Hand jarred · fresh" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 border-y border-mahogany/15 bg-secondary/50 py-5">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<badge.icon className="mb-2 h-5 w-5 text-amber-deep" strokeWidth={1.5} />
					<span className="font-mono text-[10px] uppercase tracking-[0.2em] text-mahogany">
						{badge.title}
					</span>
					<span className="font-mono mt-1 text-[10px] uppercase tracking-[0.15em] text-mahogany/55">
						{badge.description}
					</span>
				</div>
			))}
		</div>
	);
}
