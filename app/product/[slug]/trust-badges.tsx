import type { LucideIcon } from "lucide-react";
import { Droplets, RotateCcw, Shield, Thermometer } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Thermometer, title: "24h Cold / 12h Hot", description: "Insulated" },
	{ icon: Shield, title: "BPA-Free", description: "Food-grade steel" },
	{ icon: Droplets, title: "Leak-Proof", description: "Sealed lid" },
	{ icon: RotateCcw, title: "30-Day Returns", description: "Hassle-free" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
			{badges.map((badge) => (
				<div
					key={badge.title}
					className="flex flex-col items-center text-center p-3 rounded-xl bg-secondary/50"
				>
					<badge.icon className="mb-2 h-5 w-5 text-muted-foreground" />
					<span className="text-xs font-medium">{badge.title}</span>
					<span className="text-[10px] text-muted-foreground">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
