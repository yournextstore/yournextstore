import type { LucideIcon } from "lucide-react";
import { RotateCcw, Shield, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "Free Shipping", description: "Orders over $40" },
	{ icon: Shield, title: "Secure Checkout", description: "Encrypted & safe" },
	{ icon: RotateCcw, title: "30-Day Returns", description: "Hassle-free" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 neo-border divide-x divide-foreground bg-[var(--color-surface-container-lowest)]">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center px-3 py-5">
					<badge.icon className="mb-2 h-5 w-5" strokeWidth={1.5} />
					<span className="label-caps">{badge.title}</span>
					<span className="text-[11px] mt-1 text-[var(--color-on-surface-variant)]">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
