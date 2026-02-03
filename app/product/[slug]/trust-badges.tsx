import { MaterialIcon } from "@/components/icons/material-icon";

type TrustBadge = {
	icon: string;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: "local_shipping", title: "Free Shipping", description: "Orders over $40" },
	{ icon: "verified_user", title: "Lab Tested", description: "100% Pure" },
	{ icon: "replay", title: "30-Day Returns", description: "Hassle-free" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-4 rounded-xl bg-dark-accent p-4">
			{badges.map((badge) => (
				<div key={badge.title} className="flex flex-col items-center text-center">
					<MaterialIcon name={badge.icon} className="mb-2 text-xl text-primary" />
					<span className="text-xs font-medium text-white">{badge.title}</span>
					<span className="text-[10px] text-gray-400">{badge.description}</span>
				</div>
			))}
		</div>
	);
}
