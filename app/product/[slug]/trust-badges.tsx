import type { LucideIcon } from "lucide-react";
import { Leaf, Moon, ShieldCheck, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Moon, title: "ships at sundown", description: "free over $50" },
	{ icon: ShieldCheck, title: "third-party tested", description: "every batch, twice" },
	{ icon: Leaf, title: "vegan + non-habit", description: "no melatonin hangover" },
	{ icon: Truck, title: "30-night trial", description: "sleep on it, literally" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[var(--yns-ink)]/10 border border-[var(--yns-ink)]/10">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-start gap-2 bg-[var(--yns-paper)] p-4">
					<badge.icon className="h-4 w-4 text-[var(--yns-red)]" />
					<div>
						<p className="text-xs uppercase tracking-[0.15em] text-[var(--yns-ink)] lowercase">
							{badge.title}
						</p>
						<p className="text-[11px] text-[var(--yns-ink)]/60 mt-0.5 lowercase">{badge.description}</p>
					</div>
				</div>
			))}
		</div>
	);
}
