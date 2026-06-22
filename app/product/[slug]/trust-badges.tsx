import type { LucideIcon } from "lucide-react";
import { Leaf, ShieldCheck, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Fresh Shipping", description: "Cold-pack on every order" },
	{ icon: Leaf, title: "Real Ingredients", description: "Nothing artificial" },
	{ icon: ShieldCheck, title: "Happy Tummy Promise", description: "Love it or refund" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 rounded-2xl border-2 border-dashed border-[#d9c1a3] bg-[#fbf4e8] p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#c99a5e]/20 text-[#8b5e3c]">
						<badge.icon className="h-5 w-5" />
					</div>
					<span className="font-display text-xs font-bold text-[#4a2c1a]">{badge.title}</span>
					<span className="text-[10px] text-[#8b5e3c] mt-0.5">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
