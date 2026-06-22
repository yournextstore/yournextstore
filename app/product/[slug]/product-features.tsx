import { Flame, type LucideIcon, Mountain, Wind } from "lucide-react";

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
		title: "The Opening",
		description:
			"First seven minutes — bergamot torn from its peel, pink pepper, the static of a held breath.",
	},
	{
		title: "The Heart",
		description:
			"Iris root macerated for nine months. Vanilla split lengthwise. A bruised fig oozes through the middle.",
	},
	{
		title: "The Drydown",
		description:
			"Cedar smoulders for hours. Amber rests on warm skin. The room remembers you long after you've left.",
	},
];

const defaultIcons = [Wind, Flame, Mountain];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-24 border-t border-foreground/10 pt-20">
			<div className="mb-14 text-center">
				<p className="text-[10px] tracking-microcaps text-foreground/55">The Composition</p>
				<h2 className="mt-3 font-serif-display text-4xl leading-[1.05] sm:text-5xl">
					Three acts,
					<span className="italic text-peach"> one confession.</span>
				</h2>
			</div>
			<div className="grid gap-10 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col">
							<div className="mb-6 flex items-center gap-3">
								<span className="font-serif-display text-2xl italic text-saffron/85">
									{(index + 1).toString().padStart(2, "0")}
								</span>
								<span className="h-px flex-1 bg-foreground/15" />
								<Icon className="h-4 w-4 text-foreground/60" />
							</div>
							<h3 className="font-serif-display text-2xl text-foreground">{feature.title}</h3>
							<p className="mt-3 text-sm leading-relaxed text-foreground/65">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
