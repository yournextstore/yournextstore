import { Leaf, type LucideIcon, ShieldCheck, Snowflake, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Snowflake, title: "Cold chain", description: "Dry-ice shipped" },
	{ icon: Truck, title: "Free on 12-packs", description: "Orders $60+" },
	{ icon: ShieldCheck, title: "21+ verified", description: "ID at delivery" },
	{ icon: Leaf, title: "Real fruit", description: "No corn syrup" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-2xl bg-secondary p-4 border border-border">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<badge.icon className="mb-2 h-5 w-5 text-primary" />
					<span className="text-xs font-bold uppercase tracking-wider text-pop-ink">{badge.title}</span>
					<span className="text-[10px] text-muted-foreground">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
