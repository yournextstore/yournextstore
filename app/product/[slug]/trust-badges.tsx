import type { LucideIcon } from "lucide-react";
import { FlaskConical, Leaf, ShieldCheck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: FlaskConical, title: "Lab-tested", description: "Every batch screened" },
	{ icon: Leaf, title: "Forest-grown", description: "Regenerative logs" },
	{ icon: ShieldCheck, title: "60-Day Promise", description: "Love it or refund" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 rounded-2xl border border-[color:var(--color-mush-cream-deep)] bg-white p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--color-mush-yellow)]">
						<badge.icon className="h-4 w-4 text-[color:var(--color-mush-espresso)]" />
					</div>
					<span className="font-display text-[11px] tracking-[0.16em] uppercase text-[color:var(--color-mush-espresso)]">
						{badge.title}
					</span>
					<span className="text-[10px] text-[color:var(--color-mush-caramel)] mt-0.5">
						{badge.description}
					</span>
				</div>
			))}
		</div>
	);
}
