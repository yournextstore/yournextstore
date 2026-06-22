import type { LucideIcon } from "lucide-react";
import { Coffee, RotateCcw, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free Shipping", description: "Orders over $40" },
	{ icon: Coffee, title: "Freshly Roasted", description: "Bagged within 48h" },
	{ icon: RotateCcw, title: "30-Day Returns", description: "No questions asked" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 border border-[#0e0e0e]/10 bg-[#f2f2f2]">
			{badges.map((badge, i) => (
				<div
					key={badge.title}
					className={`flex flex-col items-center p-4 text-center ${i < badges.length - 1 ? "border-r border-[#0e0e0e]/10" : ""}`}
				>
					<badge.icon className="mb-2 h-5 w-5 text-[#0e0e0e]" />
					<span className="text-xs font-bold uppercase tracking-wider text-[#0e0e0e]">{badge.title}</span>
					<span className="mt-1 text-[10px] uppercase tracking-[0.15em] text-[#6e6e6e]">
						{badge.description}
					</span>
				</div>
			))}
		</div>
	);
}
