import type { LucideIcon } from "lucide-react";
import { PillIcon, ShieldCheckIcon, TruckIcon } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: TruckIcon, title: "Free delivery", description: "Orders over $35" },
	{ icon: ShieldCheckIcon, title: "100% genuine", description: "Verified pharmacy" },
	{ icon: PillIcon, title: "Pharmacist support", description: "Free consultation" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 rounded-2xl bg-mint-gradient p-4 ring-1 ring-[color:var(--mint-deep)]/8">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<span className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80">
						<badge.icon className="h-4 w-4 text-[color:var(--mint-deep)]" />
					</span>
					<span className="text-xs font-semibold text-[color:var(--mint-deep)]">{badge.title}</span>
					<span className="text-[10px] text-[color:var(--mint-deep)]/70">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
