import { Flame, Hammer, Leaf, type LucideIcon } from "lucide-react";

type Feature = {
	title: string;
	description: string;
	icon?: LucideIcon;
};

type ProductFeaturesProps = {
	features?: Feature[];
};

const defaultFeatures: Feature[] = [
	{
		title: "Made by hand",
		description:
			"Each piece is thrown, fired, woven or hammered by an artisan who signs the underside — no two are identical.",
	},
	{
		title: "Slow materials",
		description:
			"Stoneware clay, undyed linen, brass and wild beeswax — sourced patiently, finished without shortcuts.",
	},
	{
		title: "Heirloom intent",
		description:
			"Built to be lived with for decades, gathering soft patinas and stories rather than wearing out.",
	},
];

const defaultIcons = [Hammer, Leaf, Flame];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-24 border-t border-border/60 pt-16">
			<div className="text-center max-w-2xl mx-auto">
				<p className="eyebrow text-[color:var(--oxblood)]">— The Craft</p>
				<h2 className="mt-4 font-serif text-3xl sm:text-4xl text-foreground">
					Crafted with <span className="italic font-light">intention</span>
				</h2>
			</div>
			<div className="mt-14 grid gap-10 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center px-4">
							<div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[color:var(--oxblood)]/30 bg-[color:var(--sand)] transition-colors group-hover:bg-[color:var(--oxblood)]">
								<Icon className="h-5 w-5 text-[color:var(--oxblood)] transition-colors group-hover:text-cream stroke-[1.5]" />
							</div>
							<h3 className="mb-3 font-serif text-xl text-foreground">{feature.title}</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
