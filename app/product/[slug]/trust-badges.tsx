import type { LucideIcon } from "lucide-react";
import { Flame, Recycle, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free shipping", description: "Orders over $120" },
	{ icon: Flame, title: "55-hour burn", description: "Numbered batches" },
	{ icon: Recycle, title: "Refillable vessel", description: "Made to outlast" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-4 border-y border-[#e8dcc8] py-6">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<badge.icon className="mb-3 h-5 w-5 text-[#8b6b4a]" strokeWidth={1.25} />
					<span className="text-[11px] tracking-luxe uppercase text-foreground">{badge.title}</span>
					<span className="mt-1 text-[10px] text-muted-foreground">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
