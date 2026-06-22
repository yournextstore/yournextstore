import type { LucideIcon } from "lucide-react";
import { Leaf, RotateCcw, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free Shipping", description: "Orders over $35" },
	{ icon: Leaf, title: "100% Natural", description: "Plant-based, always" },
	{ icon: RotateCcw, title: "Money-Back", description: "60-day promise" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 rounded-2xl bg-[#fdf6ee] border border-[#e4d9c4] p-5">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<div className="w-9 h-9 rounded-full bg-[#b9bcf2]/40 text-[#4d4bc4] flex items-center justify-center mb-2">
						<badge.icon className="h-4 w-4" />
					</div>
					<span className="text-xs font-semibold uppercase tracking-wide text-[#1a1a2e]">{badge.title}</span>
					<span className="text-[10px] text-[#5c5b78] mt-0.5">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
