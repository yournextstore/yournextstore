import type { LucideIcon } from "lucide-react";
import { Compass, FileText, Truck } from "lucide-react";

type TrustBadge = {
	icon: LucideIcon;
	title: string;
	description: string;
};

const defaultBadges: TrustBadge[] = [
	{ icon: Truck, title: "White-glove delivery", description: "On all orders" },
	{ icon: FileText, title: "Maker's certificate", description: "Signed & dated" },
	{ icon: Compass, title: "Lifetime archive", description: "Restoration access" },
];

export function TrustBadges({ badges = defaultBadges }: { badges?: TrustBadge[] }) {
	return (
		<div className="grid grid-cols-3 gap-2 rounded-md border border-border/60 bg-parchment p-4">
			{badges.map((badge, idx) => (
				<div
					key={badge.title}
					className={`flex flex-col items-center text-center px-2 ${idx > 0 ? "border-l border-border/60" : ""}`}
				>
					<badge.icon className="mb-2 h-4 w-4 text-foreground" />
					<span className="font-editorial italic text-sm leading-tight text-foreground">{badge.title}</span>
					<span className="mt-1 font-grotesk text-[10px] uppercase tracking-eyebrow text-muted-foreground">
						{badge.description}
					</span>
				</div>
			))}
		</div>
	);
}
