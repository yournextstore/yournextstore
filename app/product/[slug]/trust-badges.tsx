import type { LucideIcon } from "lucide-react";
import { FlaskConical, Leaf, ShieldCheck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: FlaskConical, title: "Third-party tested", description: "Every batch, every active" },
	{ icon: ShieldCheck, title: "NSF certified", description: "Clinical-grade purity" },
	{ icon: Leaf, title: "Vegan capsules", description: "No fillers, no shortcuts" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-2 rounded-xl border border-border bg-background p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center gap-1.5">
					<badge.icon className="h-5 w-5 text-moss" />
					<span className="text-[0.72rem] font-medium text-foreground leading-tight">{badge.title}</span>
					<span className="text-[0.65rem] text-muted-foreground leading-tight">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
