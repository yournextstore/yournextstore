import type { LucideIcon } from "lucide-react";
import { Leaf, RotateCcw, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free EU shipping", description: "On orders over €300" },
	{ icon: Leaf, title: "FSC timber", description: "Plant-based pigments" },
	{ icon: RotateCcw, title: "60-day returns", description: "Hand-finished, hand-checked" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-0 border-y border-[color:var(--border)]">
			{badges.map((badge, i) => (
				<div
					key={badge.title}
					className={`flex flex-col items-start gap-1 py-4 ${i > 0 ? "border-l border-[color:var(--border)] pl-4" : "pr-4"}`}
				>
					<badge.icon className="h-4 w-4 text-[color:var(--yns-terracotta)]" />
					<span className="mt-1 text-[13px] font-medium text-foreground">{badge.title}</span>
					<span className="text-[11px] text-muted-foreground leading-tight">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
