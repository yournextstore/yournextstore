import type { LucideIcon } from "lucide-react";
import { RotateCcw, Shield, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free Shipping", description: "Orders over $75" },
	{ icon: Shield, title: "2-Year Warranty", description: "Full coverage" },
	{ icon: RotateCcw, title: "365-Day Returns", description: "Hassle-free" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-4 border border-border p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<div className="mb-2 flex h-8 w-8 items-center justify-center bg-brand text-brand-foreground">
						<badge.icon className="h-4 w-4" />
					</div>
					<span className="font-heading text-xs font-bold uppercase">{badge.title}</span>
					<span className="text-[10px] text-muted-foreground">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
