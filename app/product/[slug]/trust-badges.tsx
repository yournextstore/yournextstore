import type { LucideIcon } from "lucide-react";
import { RotateCcw, Shield, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "White-glove delivery", description: "Complimentary on orders over $500" },
	{ icon: Shield, title: "10-year warranty", description: "On every joinery & finish" },
	{ icon: RotateCcw, title: "30-day returns", description: "No question asked" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-0 rounded-sm border border-border/70 bg-background overflow-hidden">
			{badges.map((badge, idx) => (
				<div
					key={badge.title}
					className={`flex flex-col items-center text-center p-4 sm:p-5 ${idx > 0 ? "border-l border-border/70" : ""}`}
				>
					<badge.icon className="mb-2.5 h-4 w-4 text-muted-foreground" strokeWidth={1.4} />
					<span className="editorial-eyebrow text-foreground">{badge.title}</span>
					<span className="mt-1 text-[10px] text-muted-foreground leading-snug max-w-[20ch]">
						{badge.description}
					</span>
				</div>
			))}
		</div>
	);
}
