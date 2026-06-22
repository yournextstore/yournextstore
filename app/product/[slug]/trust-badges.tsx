import { Leaf, type LucideIcon, RefreshCw, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free Shipping", description: "Over $35" },
	{ icon: RefreshCw, title: "Refill & Save", description: "15% subscription off" },
	{ icon: Leaf, title: "Plastic Negative", description: "5 lbs removed per order" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 rounded-2xl bg-[#EAE0CF]/60 border border-[#E0D5C1] p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#8FB1C7]/20 text-[#1F2A33]">
						<badge.icon className="h-4 w-4" />
					</div>
					<span className="text-xs font-semibold text-[#1F2A33]">{badge.title}</span>
					<span className="text-[10px] text-[#3B4856]">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
