import { Award, Hammer, Leaf, type LucideIcon } from "lucide-react";
import { getCachedTranslations } from "@/lib/translations";

type Feature = {
	title: string;
	description: string;
	icon?: LucideIcon;
};

type ProductFeaturesProps = {
	locale: string;
	features?: Feature[];
};

const defaultIcons = [Leaf, Hammer, Award];

export async function ProductFeatures({ locale, features }: ProductFeaturesProps) {
	const t = await getCachedTranslations(locale, "ProductFeatures");

	const defaultFeatures: Feature[] = [
		{
			title: t("sustainableTitle"),
			description: t("sustainableDescription"),
		},
		{
			title: t("craftsmanshipTitle"),
			description: t("craftsmanshipDescription"),
		},
		{
			title: t("qualityTitle"),
			description: t("qualityDescription"),
		},
	];

	const displayFeatures = features ?? defaultFeatures;

	return (
		<section className="mt-20 border-t border-border pt-16">
			<h2 className="mb-12 text-center text-3xl font-medium tracking-tight">{t("sectionTitle")}</h2>
			<div className="grid gap-8 md:grid-cols-3">
				{displayFeatures.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary transition-colors group-hover:bg-foreground">
								<Icon className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary-foreground" />
							</div>
							<h3 className="mb-2 text-lg font-medium">{feature.title}</h3>
							<p className="text-sm text-muted-foreground">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
