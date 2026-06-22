import type { LucideIcon } from "lucide-react";
import { Plane, RefreshCcw, Sparkles } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Plane, title: "Express Delivery", description: "On orders over $250" },
	{ icon: Sparkles, title: "Atelier Authenticated", description: "Inspected in Antwerp" },
	{ icon: RefreshCcw, title: "Effortless Returns", description: "30 days, no questions" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 border border-border/70 p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<badge.icon className="mb-2 h-4 w-4 text-foreground" strokeWidth={1.5} />
					<span className="text-[11px] uppercase tracking-[0.18em] text-foreground">{badge.title}</span>
					<span className="mt-0.5 text-[10px] text-muted-foreground">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
