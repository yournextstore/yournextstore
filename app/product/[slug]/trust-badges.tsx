import type { LucideIcon } from "lucide-react";
import { Leaf, Truck, Wheat } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Wheat, title: "Gluten-Free", description: "Certified GF oats" },
	{ icon: Leaf, title: "Real Ingredients", description: "Organic, whole foods" },
	{ icon: Truck, title: "Free Shipping", description: "On orders over $45" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 rounded-2xl border border-[#E5D3B7] bg-[#F6ECDC] p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<badge.icon className="mb-2 h-5 w-5 text-[#8C1F2A]" />
					<span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#2A2A2A]">
						{badge.title}
					</span>
					<span className="text-[10px] text-[#5a4a3a]">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
