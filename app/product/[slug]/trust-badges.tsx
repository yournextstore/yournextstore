import type { LucideIcon } from "lucide-react";
import { FlaskConical, RotateCcw, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free US shipping", description: "On every order" },
	{ icon: FlaskConical, title: "3rd-party tested", description: "Independent labs" },
	{ icon: RotateCcw, title: "30-day promise", description: "Or your money back" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-2 rounded-sm border border-border/60 bg-[color:var(--secondary)] p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center px-1">
					<badge.icon className="mb-2 h-5 w-5 text-terracotta" strokeWidth={1.6} />
					<span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink">
						{badge.title}
					</span>
					<span className="mt-0.5 text-[10px] text-clay">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
