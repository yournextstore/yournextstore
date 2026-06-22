import type { LucideIcon } from "lucide-react";
import { Heart, PackageCheck, Sparkles, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free shipping", description: "On orders over $60" },
	{ icon: PackageCheck, title: "Safety tested", description: "From newborn up" },
	{ icon: Sparkles, title: "Hand finished", description: "In our London studio" },
	{ icon: Heart, title: "Forever friend", description: "Made to be cuddled" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-3xl bg-[var(--color-mint-soft)]/60 p-5">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center gap-1.5">
					<span className="h-10 w-10 rounded-full bg-white inline-flex items-center justify-center text-[var(--color-mint-deep)]">
						<badge.icon className="h-4 w-4" />
					</span>
					<span className="text-xs font-semibold text-foreground">{badge.title}</span>
					<span className="text-[10px] text-muted-foreground">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
