import type { LucideIcon } from "lucide-react";
import { FlaskConical, Leaf, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free Shipping", description: "On orders over $60" },
	{ icon: FlaskConical, title: "NSF Certified", description: "For Sport" },
	{ icon: Leaf, title: "No Added Sugar", description: "Clean formula" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-px rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center gap-2 bg-card p-5">
					<badge.icon className="h-5 w-5 text-lilac" strokeWidth={1.5} />
					<span className="text-xs font-medium tracking-wide text-bone">{badge.title}</span>
					<span className="text-[10px] tracking-[0.18em] uppercase text-foreground/55">
						{badge.description}
					</span>
				</div>
			))}
		</div>
	);
}
