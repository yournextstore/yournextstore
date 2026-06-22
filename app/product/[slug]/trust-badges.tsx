import type { LucideIcon } from "lucide-react";
import { Leaf, ShieldCheck, Sparkles } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: ShieldCheck, title: "Third-party tested", description: "Every batch verified" },
	{ icon: Leaf, title: "Vegan & sugar-free", description: "Clean labels only" },
	{ icon: Sparkles, title: "60-day promise", description: "Love it or refund" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 rounded-2xl bg-[#f7e4d4] p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white">
						<badge.icon className="h-4 w-4 text-[#4b1fb5]" />
					</div>
					<span className="text-xs font-extrabold text-[#1a0f4d]">{badge.title}</span>
					<span className="text-[10px] text-[#1a0f4d]/60">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
