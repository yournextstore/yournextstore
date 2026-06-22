import { Compass, type LucideIcon, Mountain, ScrollText } from "lucide-react";

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
		title: "Drawn in 1955",
		description:
			"The original brief, drawn in graphite, still hangs above the workshop. Every shell traces back to it.",
	},
	{
		title: "Seven-layer plywood",
		description:
			"Sheets of European beech are bent in a steam-pressed mould and sanded by hand to a sculptural shell.",
	},
	{
		title: "From the archive",
		description:
			"Each piece is numbered, stamped and shipped with a certificate signed by the maker who finished it.",
	},
];

const defaultIcons = [ScrollText, Mountain, Compass];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-24 border-t border-border/60 pt-16">
			<div className="font-grotesk text-[10px] uppercase tracking-eyebrow text-muted-foreground mb-4 flex items-center gap-3">
				<span aria-hidden className="block h-px w-8 bg-foreground" />
				the brief
			</div>
			<h2 className="font-editorial italic font-light text-4xl md:text-5xl leading-[0.95] tracking-tight text-foreground max-w-xl">
				Made the slow way, on purpose.
			</h2>
			<div className="mt-12 grid gap-px md:grid-cols-3 bg-border/60 border border-border/60 rounded-md overflow-hidden">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="bg-background p-8">
							<div className="flex items-center justify-between mb-6">
								<Icon className="h-5 w-5 text-accent" />
								<span className="font-grotesk text-[10px] uppercase tracking-eyebrow text-muted-foreground">
									0{index + 1} / 03
								</span>
							</div>
							<h3 className="font-editorial italic text-2xl leading-tight text-foreground mb-3">
								{feature.title}
							</h3>
							<p className="font-grotesk text-sm leading-relaxed text-muted-foreground">
								{feature.description}
							</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
