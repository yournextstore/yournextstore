import type { LucideIcon } from "lucide-react";
import { BadgeCheck, RotateCcw, ShieldCheck, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: BadgeCheck, title: "100% Authentic", description: "Sourced direct" },
	{ icon: Truck, title: "Worldwide Delivery", description: "Tracked & insured" },
	{ icon: RotateCcw, title: "Free Returns", description: "30 days, easy" },
	{ icon: ShieldCheck, title: "Safe Payments", description: "Encrypted checkout" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-2xl bg-[--sun]/10 ring-1 ring-[--ember]/15 p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex items-start gap-3">
					<span className="grid place-items-center h-9 w-9 rounded-full bg-white ring-1 ring-[--ember]/20 text-[--ember] shrink-0">
						<badge.icon className="h-4 w-4" />
					</span>
					<div className="min-w-0">
						<p className="text-xs font-semibold text-[--ink] leading-tight">{badge.title}</p>
						<p className="text-[11px] text-[--ink]/55 leading-tight mt-0.5">{badge.description}</p>
					</div>
				</div>
			))}
		</div>
	);
}
