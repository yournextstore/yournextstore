import type { LucideIcon } from "lucide-react";
import { BookOpen, Feather, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Feather, title: "Hand-bound", description: "Small-batch printing" },
	{ icon: Truck, title: "Slow shipping", description: "Recycled paper, gently" },
	{ icon: BookOpen, title: "Read-it returns", description: "30 days, no questions" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 rounded-xl border-2 border-ink bg-cream-dark p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<badge.icon className="mb-2 h-5 w-5 text-cobalt" />
					<span className="text-xs font-semibold text-foreground">{badge.title}</span>
					<span className="text-[10px] text-muted-foreground mt-0.5">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
