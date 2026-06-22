import type { LucideIcon } from "lucide-react";
import { Snowflake, Truck, Zap } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free Shipping", description: "On orders $50+" },
	{ icon: Snowflake, title: "Cold-Chain", description: "Always served chilled" },
	{ icon: Zap, title: "Nitro-Infused", description: "Velvet smooth pour" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<badge.icon className="mb-2 h-5 w-5 text-[var(--color-yns-yellow)]" />
					<span className="text-xs font-semibold text-white/90">{badge.title}</span>
					<span className="text-[10px] text-white/50">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
