import type { LucideIcon } from "lucide-react";
import { Hammer, RotateCcw, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Complimentary shipping", description: "On orders over $180" },
	{ icon: Hammer, title: "Lifetime repair", description: "Send it back, we mend it" },
	{ icon: RotateCcw, title: "30-day returns", description: "Slow, unhurried" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-4 rounded-md border border-border bg-sand/40 p-5">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center gap-1.5">
					<badge.icon className="h-5 w-5 text-clay" />
					<span className="font-serif text-sm text-walnut">{badge.title}</span>
					<span className="text-[10px] uppercase tracking-[0.18em] text-espresso/55">
						{badge.description}
					</span>
				</div>
			))}
		</div>
	);
}
