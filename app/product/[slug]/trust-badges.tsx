import type { LucideIcon } from "lucide-react";
import { Droplets, Leaf, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free shipping", description: "Orders over $40" },
	{ icon: Leaf, title: "Real honey", description: "Non‑GMO, no dyes" },
	{ icon: Droplets, title: "Electrolyte blend", description: "Fuel that bounces back" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 rounded-2xl bg-[--color-butter] border-2 border-foreground p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<span className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white border-2 border-foreground">
						<badge.icon className="h-4 w-4" />
					</span>
					<span className="text-[11px] font-display font-extrabold uppercase tracking-wide">
						{badge.title}
					</span>
					<span className="text-[10px] text-foreground/70 mt-0.5">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
