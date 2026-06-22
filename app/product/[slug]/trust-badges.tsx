import { Droplet, type LucideIcon, ShieldCheck, Sparkles, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Droplet, title: "Sweat-proof", description: "Tested in heat & humidity" },
	{ icon: Sparkles, title: "12-Hour Wear", description: "From AM to encore" },
	{ icon: ShieldCheck, title: "Clean Formula", description: "Dermatologist tested" },
	{ icon: Truck, title: "Free Shipping", description: "On orders $75+" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-2 gap-px overflow-hidden border border-border bg-border sm:grid-cols-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center bg-cream p-4 text-center">
					<badge.icon className="mb-2 h-4 w-4 text-bronze" />
					<span className="eyebrow text-[10px] text-ink">{badge.title}</span>
					<span className="mt-1 text-[10px] text-muted-foreground">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
