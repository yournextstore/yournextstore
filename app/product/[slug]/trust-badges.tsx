import type { LucideIcon } from "lucide-react";
import { Leaf, ShieldCheck, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Leaf, title: "100% Plant-Based", description: "Always vegan" },
	{ icon: ShieldCheck, title: "Third-Party Tested", description: "For purity" },
	{ icon: Truck, title: "Free Shipping", description: "Orders over $40" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 rounded-2xl border border-[#1b2a2e]/10 bg-white p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#f5a623]/15 text-[#f5a623]">
						<badge.icon className="h-5 w-5" />
					</div>
					<span className="font-display text-xs font-bold text-[#1b2a2e]">{badge.title}</span>
					<span className="text-[10px] text-[#1b2a2e]/60">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
