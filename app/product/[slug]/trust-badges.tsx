import type { LucideIcon } from "lucide-react";
import { Hand, Leaf, ShieldCheck, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Hand, title: "Handmade", description: "By artisans" },
	{ icon: Truck, title: "Free Shipping", description: "Orders $80+" },
	{ icon: Leaf, title: "Natural Materials", description: "Sourced slowly" },
	{ icon: ShieldCheck, title: "Care Promise", description: "30-day returns" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-sm border border-border/70 bg-card/60 backdrop-blur-sm p-5">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center px-1">
					<badge.icon className="mb-2 h-5 w-5 text-[color:var(--oxblood)] stroke-[1.5]" />
					<span className="font-serif text-[15px] text-foreground leading-tight">{badge.title}</span>
					<span className="mt-0.5 text-[10px] tracking-[0.16em] uppercase text-muted-foreground">
						{badge.description}
					</span>
				</div>
			))}
		</div>
	);
}
