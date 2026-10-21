import type { LucideIcon } from "lucide-react";
import { BadgeDollarSign, Gem, Heart, ShieldCheck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: BadgeDollarSign, title: "Clear prices" },
	{ icon: ShieldCheck, title: "Secure checkout" },
	{ icon: Heart, title: "Chosen with care" },
	{ icon: Gem, title: "Made to last" },
];

/** The original's row of round icon tiles under the buy button. */
export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<ul className="grid grid-cols-2 gap-x-4 gap-y-6 pt-4 sm:grid-cols-4">
			{badges.map((badge) => (
				<li key={badge.title} className="flex flex-col items-center gap-4 text-center">
					<span className="flex h-16 w-16 items-center justify-center rounded-full bg-tile">
						<badge.icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.25} />
					</span>
					<span className="text-sm/5 uppercase">{badge.title}</span>
				</li>
			))}
		</ul>
	);
}
