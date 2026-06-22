import type { LucideIcon } from "lucide-react";
import { PackageCheck, ShieldCheck, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Slow shipping", description: "Hand-packed on Tuesdays" },
	{ icon: ShieldCheck, title: "Quietly guaranteed", description: "Made to last decades" },
	{ icon: PackageCheck, title: "30 day returns", description: "If it doesn't fit the table" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 sm:gap-4 rounded-sm bg-[#fbf3e6] border border-[#d8c4a8]/60 p-4 sm:p-5">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#1f46c2]/10 text-[#1f46c2]">
						<badge.icon className="h-4 w-4" />
					</div>
					<span className="font-display text-sm text-[#2a2622] leading-tight">{badge.title}</span>
					<span className="text-[10px] uppercase tracking-[0.18em] text-[#6b5e4e] mt-1">
						{badge.description}
					</span>
				</div>
			))}
		</div>
	);
}
