import type { LucideIcon } from "lucide-react";
import { Plane, ShieldCheck, Sparkles } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Plane, title: "Worldwide Shipping", description: "Complimentary over $300" },
	{ icon: ShieldCheck, title: "Authenticity", description: "Verified by atelier" },
	{ icon: Sparkles, title: "Considered Care", description: "Lifetime garment repair" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 border-y border-border divide-x divide-border">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center px-2 py-5">
					<badge.icon className="mb-3 h-4 w-4 text-foreground" strokeWidth={1.4} />
					<span className="text-[10px] tracking-[0.2em] uppercase font-medium text-foreground">
						{badge.title}
					</span>
					<span className="mt-1 text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
						{badge.description}
					</span>
				</div>
			))}
		</div>
	);
}
