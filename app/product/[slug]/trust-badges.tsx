import type { LucideIcon } from "lucide-react";
import { Leaf, Package, RotateCcw, Scissors } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Scissors, title: "Made-to-order", description: "Hand-finished" },
	{ icon: Leaf, title: "Natural fibres", description: "Linen · Silk · Wool" },
	{ icon: Package, title: "Free shipping", description: "Worldwide over $250" },
	{ icon: RotateCcw, title: "30-day returns", description: "On full-priced pieces" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden ring-1 ring-border">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-start gap-2 bg-background p-4">
					<badge.icon className="h-4 w-4 text-bronze" strokeWidth={1.5} />
					<div>
						<span className="block text-[11px] font-medium tracking-wider uppercase text-foreground">
							{badge.title}
						</span>
						<span className="block text-[11px] text-muted-foreground mt-0.5">{badge.description}</span>
					</div>
				</div>
			))}
		</div>
	);
}
