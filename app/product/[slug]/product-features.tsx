import { Activity, FlaskConical, type LucideIcon, Snowflake } from "lucide-react";

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
		title: "Endurance Electrolytes",
		description: "Six electrolytes calibrated to a 24-hour endurance profile — not a vending machine.",
	},
	{
		title: "Tested in Heat",
		description: "Validated against real athletes in real conditions before any flavor leaves the lab.",
	},
	{
		title: "Cold-Filled Cans",
		description: "Aluminum keeps the formula tight, the carbonation clean, and the planet fewer plastics.",
	},
];

const defaultIcons = [Activity, FlaskConical, Snowflake];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-24 border-t border-white/10 pt-16">
			<div className="text-center mb-14">
				<div className="text-[10px] tracking-[0.32em] uppercase text-lilac mb-5">— Why Y.N.S</div>
				<h2 className="font-display font-light text-bone text-4xl sm:text-5xl tracking-[-0.02em] leading-[0.95]">
					Designed to <span className="italic">replace</span> what you sweat.
				</h2>
			</div>
			<div className="grid gap-px bg-white/10 rounded-2xl overflow-hidden md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div
							key={feature.title}
							className="group bg-background p-8 sm:p-10 flex flex-col gap-5 min-h-[240px]"
						>
							<Icon className="h-7 w-7 text-lilac" strokeWidth={1.25} />
							<h3 className="font-display text-2xl text-bone leading-tight">{feature.title}</h3>
							<p className="text-sm text-foreground/65 leading-relaxed mt-auto">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
