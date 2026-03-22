"use client";

import type { LucideIcon } from "lucide-react";
import { RotateCcw, Shield, Truck } from "lucide-react";
import { useTranslations } from "next-intl";

type TrustBadge = {
	icon: LucideIcon;
	titleKey: string;
	descriptionKey: string;
};

export function TrustBadges() {
	const t = useTranslations("TrustBadges");

	const badges: TrustBadge[] = [
		{ icon: Truck, titleKey: "freeShipping", descriptionKey: "freeShippingDescription" },
		{ icon: Shield, titleKey: "warranty", descriptionKey: "warrantyDescription" },
		{ icon: RotateCcw, titleKey: "returns", descriptionKey: "returnsDescription" },
	];
	return (
		<div className="grid grid-cols-3 gap-4 rounded-xl bg-secondary/50 p-4">
			{badges.map((badge) => (
				<div key={badge.titleKey} className="flex flex-col items-center text-center">
					<badge.icon className="mb-2 h-5 w-5 text-muted-foreground" />
					<span className="text-xs font-medium">{t(badge.titleKey)}</span>
					<span className="text-[10px] text-muted-foreground">{t(badge.descriptionKey)}</span>
				</div>
			))}
		</div>
	);
}
