import type { LucideIcon } from "lucide-react";
import { Cookie, Leaf, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free Shipping", description: "On orders over $40" },
	{ icon: Cookie, title: "Baked Fresh", description: "Shipped weekly" },
	{ icon: Leaf, title: "Better-for-you", description: "Gluten · dairy · nut-free" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 rounded-2xl border-2 border-[#3a4a8c]/15 bg-[#fcefa8] p-4 shadow-pop">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<badge.icon className="mb-2 h-5 w-5 text-[#e8456a]" />
					<span className="text-xs font-extrabold uppercase tracking-wider text-[#3a4a8c]">
						{badge.title}
					</span>
					<span className="text-[10px] text-[#3a4a8c]/70">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
