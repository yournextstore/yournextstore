import type { LucideIcon } from "lucide-react";
import { Recycle, Sparkles, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free over $75", description: "Lower-48 ground" },
	{ icon: Sparkles, title: "Real fruit", description: "Less sugar, more fizz" },
	{ icon: Recycle, title: "100% recyclable", description: "Aluminum forever" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 rounded-3xl bg-[var(--tizz-yellow)] border-2 border-[var(--tizz-deep)] p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<badge.icon className="mb-2 h-6 w-6 text-[var(--tizz-orange)]" strokeWidth={2.5} />
					<span className="tizz-overline text-[10px] text-[var(--tizz-deep)]">{badge.title}</span>
					<span className="text-[10px] text-[var(--tizz-deep)]/70 mt-0.5">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
