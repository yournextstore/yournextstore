import type { LucideIcon } from "lucide-react";
import { Gift, ShieldCheck, Sparkles } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Sparkles, title: "Free Sample", description: "With every order" },
	{ icon: ShieldCheck, title: "Authentic", description: "Sourced direct" },
	{ icon: Gift, title: "Gift Wrapped", description: "On request" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-3 rounded-2xl border border-border/60 bg-[color:var(--color-luxe-cream)]/40 p-4 backdrop-blur">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[color:var(--color-luxe-violet)] shadow-sm">
						<badge.icon className="h-4 w-4" />
					</div>
					<span className="text-xs font-semibold">{badge.title}</span>
					<span className="text-[10px] text-muted-foreground">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
