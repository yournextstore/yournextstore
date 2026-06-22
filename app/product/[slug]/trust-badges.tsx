import type { LucideIcon } from "lucide-react";
import { RotateCcw, Shield, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free White-Glove Delivery", description: "On orders over $500" },
	{ icon: Shield, title: "10-Year Frame Warranty", description: "Built to outlast trends" },
	{ icon: RotateCcw, title: "30-Day Home Trial", description: "Live with it, then decide" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 rounded-[1.5rem] bg-[#f5e8e4]/50 ring-1 ring-black/5 p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<span className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0f0f0f] text-white">
						<badge.icon className="h-4 w-4" />
					</span>
					<span className="text-xs font-semibold text-[#0f0f0f]">{badge.title}</span>
					<span className="text-[11px] text-neutral-500 mt-0.5">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
