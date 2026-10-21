import type { LucideIcon } from "lucide-react";
import { LeafIcon, ShieldCheckIcon, TruckIcon } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: TruckIcon, title: "Shipping options shown at checkout" },
	{ icon: ShieldCheckIcon, title: "Secure checkout" },
	{ icon: LeafIcon, title: "Thoughtfully made to last" },
];

/** The original's line-icon list under the add-to-cart button. */
export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<ul className="space-y-2.5">
			{badges.map((badge) => (
				<li key={badge.title} className="flex items-center gap-3 text-body-sm">
					<badge.icon aria-hidden className="size-4.5 shrink-0" strokeWidth={1.5} />
					{badge.title}
				</li>
			))}
		</ul>
	);
}
