import type { LucideIcon } from "lucide-react";
import { CreditCard, FileText, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: CreditCard, title: "Secure Checkout", description: "Encrypted payment" },
	{ icon: Truck, title: "Delivery", description: "Options at checkout" },
	{ icon: FileText, title: "Store Policies", description: "Always on hand" },
];

/** The original's three-up row under the button: an icon, a bold label and a small line. */
export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<ul className="mt-8 grid grid-cols-3 gap-4 border-t border-earth/10 pt-8">
			{badges.map((badge) => (
				<li key={badge.title} className="text-center">
					<badge.icon className="mx-auto mb-2 size-6 text-crimson" strokeWidth={1.5} aria-hidden="true" />
					<p className="font-body text-xs font-semibold text-earth">{badge.title}</p>
					<p className="font-body text-2xs text-earth-soft">{badge.description}</p>
				</li>
			))}
		</ul>
	);
}
