import type { LucideIcon } from "lucide-react";
import { Package, ShieldCheck, Undo2 } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Package, title: "Free shipping", description: "Orders over $150" },
	{ icon: ShieldCheck, title: "Authenticity", description: "Serialized & sealed" },
	{ icon: Undo2, title: "30-day returns", description: "On unworn items" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-2 rounded-2xl border border-border bg-secondary/30 p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center px-2">
					<badge.icon className="mb-2 h-5 w-5 text-cyan-200" />
					<span className="text-[11px] font-mono uppercase tracking-[0.18em] text-foreground">
						{badge.title}
					</span>
					<span className="mt-0.5 text-[10px] text-foreground/50">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
