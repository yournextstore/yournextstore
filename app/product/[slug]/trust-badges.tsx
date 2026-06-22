import type { LucideIcon } from "lucide-react";
import { Leaf, ShieldCheck, TestTube2 } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: TestTube2, title: "Third-party tested", description: "Beta-glucans verified" },
	{ icon: Leaf, title: "Wild-harvested", description: "Small-farm sourcing" },
	{ icon: ShieldCheck, title: "Dual-extracted", description: "Full-spectrum potency" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 rounded-[6px] border border-border bg-[#ece4d2] p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<badge.icon className="mb-2 h-5 w-5 text-[#4a5bc4]" strokeWidth={1.5} />
					<span className="font-label text-[10px] text-foreground">{badge.title}</span>
					<span className="mt-0.5 text-[10px] text-foreground/55">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
