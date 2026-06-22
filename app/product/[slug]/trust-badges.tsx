import type { LucideIcon } from "lucide-react";
import { Leaf, Sparkles, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free shipping", description: "On orders $35+" },
	{ icon: Sparkles, title: "Small-batch", description: "Tinned monthly" },
	{ icon: Leaf, title: "No fillers", description: "Whole spices only" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-4 rounded-2xl bg-[#fbe5ea] p-5 border border-[#efd6dc]">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<badge.icon className="mb-2 h-5 w-5 text-[#b81e26]" />
					<span className="text-xs font-semibold text-[#7a0e15]">{badge.title}</span>
					<span className="text-[10px] text-[#2b2120]/60 mt-0.5">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
