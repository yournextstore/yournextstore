import type { LucideIcon } from "lucide-react";
import { Hammer, Leaf, RotateCcw, Shield, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "White-Glove Delivery", description: "Free over $500" },
	{ icon: Shield, title: "12-Year Craft Warranty", description: "Joinery + upholstery" },
	{ icon: RotateCcw, title: "30-Day Returns", description: "Unused furniture" },
	{ icon: Leaf, title: "FSC-Sourced Wood", description: "Slow-grown, traceable" },
	{ icon: Hammer, title: "Studio-Made", description: "Never factory-line" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-2xl border border-[#1f2933]/10 bg-[#f5f1ea]/70 p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex items-start gap-3 rounded-xl bg-white/70 p-3">
					<badge.icon className="mt-0.5 h-4 w-4 shrink-0 text-[#c8a57a]" />
					<div className="text-left">
						<div className="text-[12px] font-medium text-[#1f2933] leading-tight">{badge.title}</div>
						<div className="text-[11px] text-[#1f2933]/55 leading-tight">{badge.description}</div>
					</div>
				</div>
			))}
		</div>
	);
}
