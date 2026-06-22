import type { LucideIcon } from "lucide-react";
import { Hammer, Leaf, ShieldCheck, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free shipping", description: "Orders over $200" },
	{ icon: ShieldCheck, title: "Lifetime repairs", description: "Stitching & edges" },
	{ icon: Hammer, title: "Handcrafted", description: "Small batch, Italy" },
	{ icon: Leaf, title: "Veg-tanned", description: "Single tannery sourced" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-3xl bg-secondary p-2">
			{badges.map((badge) => (
				<div
					key={badge.title}
					className="flex flex-col items-center text-center rounded-2xl bg-background border border-border px-3 py-4"
				>
					<badge.icon className="mb-2 h-5 w-5 text-tan" />
					<span className="text-xs font-medium text-foreground">{badge.title}</span>
					<span className="text-[10px] text-muted-foreground mt-0.5">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
