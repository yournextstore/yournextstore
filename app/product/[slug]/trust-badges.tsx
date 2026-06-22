import type { LucideIcon } from "lucide-react";
import { Cpu, Shield, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free express ship", description: "Builds over $1,499" },
	{ icon: Shield, title: "2-year warranty", description: "Parts & labor" },
	{ icon: Cpu, title: "Stress-tested", description: "Validated under load" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-4 backdrop-blur-sm">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<div
						className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl"
						style={{
							background: "linear-gradient(135deg, rgba(217,70,196,0.15), rgba(168,85,247,0.1))",
							border: "1px solid rgba(217,70,196,0.2)",
						}}
					>
						<badge.icon className="h-4 w-4 text-primary" />
					</div>
					<span className="text-xs font-medium text-foreground">{badge.title}</span>
					<span className="text-[10px] text-muted-foreground">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
