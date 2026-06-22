import type { LucideIcon } from "lucide-react";
import { HeartHandshake, Leaf, Sparkles, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free Shipping", description: "On orders $50+" },
	{ icon: Sparkles, title: "Skin-Safe", description: "Medical-grade silicone" },
	{ icon: HeartHandshake, title: "Real-Body Fit", description: "AA → KK tested" },
	{ icon: Leaf, title: "Reusable", description: "Up to 30 wears" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-2xl bg-blush-soft p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center px-1">
					<badge.icon className="mb-2 h-5 w-5 text-magenta" />
					<span className="text-xs font-semibold text-foreground tracking-wide">{badge.title}</span>
					<span className="text-[10px] text-foreground/65 mt-0.5">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
