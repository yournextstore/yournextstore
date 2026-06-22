import type { LucideIcon } from "lucide-react";
import { Leaf, Shield, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "White-glove delivery", description: "Scheduled in-room placement" },
	{ icon: Shield, title: "10-year warranty", description: "Frame & joinery guaranteed" },
	{ icon: Leaf, title: "Sustainably made", description: "FSC oak & natural fibres" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-0 rounded-sm border hairline bg-[var(--cream)]/50 divide-x divide-[var(--cream-deep)]">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center p-4">
					<badge.icon className="mb-2 h-4 w-4 text-[var(--forest)]" />
					<span className="text-[11px] tracking-[0.14em] uppercase font-medium text-foreground">
						{badge.title}
					</span>
					<span className="text-[10px] text-foreground/55 mt-1">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
