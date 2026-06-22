import type { LucideIcon } from "lucide-react";
import { ShieldCheckIcon, SunIcon, TruckIcon } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: TruckIcon, title: "Free shipping", description: "On systems $2,500+" },
	{ icon: ShieldCheckIcon, title: "25-yr warranty", description: "Performance guarantee" },
	{ icon: SunIcon, title: "Tax credit eligible", description: "Save 30% federally" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 rounded-2xl bg-[var(--lime-soft)] p-4 ring-1 ring-[var(--forest-deep)]/10">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center gap-1.5">
					<span className="flex size-9 items-center justify-center rounded-full bg-[var(--forest)] text-[var(--lime)]">
						<badge.icon className="h-4 w-4" />
					</span>
					<span className="text-xs font-semibold text-[var(--forest-deep)]">{badge.title}</span>
					<span className="text-[10px] text-[var(--forest-deep)]/70">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
