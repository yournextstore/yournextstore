import type { LucideIcon } from "lucide-react";
import { Check, HandHeart, Leaf } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
};

// The original's three-up row under the buy buttons (leaf, hand, tick), with store-neutral labels.
const defaultBadges: TrustBadge[] = [
	{ icon: Leaf, title: "Chosen with care" },
	{ icon: HandHeart, title: "Questions? Just ask" },
	{ icon: Check, title: "Secure checkout" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<ul className="grid grid-cols-3 gap-4 border-t border-line pt-6">
			{badges.map((badge) => (
				<li key={badge.title} className="flex flex-col items-center gap-2 text-center">
					<badge.icon className="size-6 text-pine" strokeWidth={1.5} aria-hidden="true" />
					<span className="text-sm text-muted-foreground">{badge.title}</span>
				</li>
			))}
		</ul>
	);
}
