import type { LucideIcon } from "lucide-react";
import { FlaskConical, Leaf, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: FlaskConical, title: "Third-party tested", description: "Every batch, every time" },
	{ icon: Leaf, title: "No melatonin", description: "Non-habit forming" },
	{ icon: Truck, title: "Free shipping", description: "On orders over $50" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-4 rounded-md border border-border bg-cream/60 p-5">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<badge.icon className="mb-2 h-5 w-5 text-primary" strokeWidth={1.4} />
					<span className="text-xs font-medium text-foreground">{badge.title}</span>
					<span className="text-[10px] text-muted-foreground mt-0.5">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
