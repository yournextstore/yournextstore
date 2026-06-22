import { Award, Hammer, Leaf, type LucideIcon } from "lucide-react";

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
		title: "FSC-sourced solid wood",
		description: "Slow-grown oak, ash and walnut from certified forests. Joinery cut, not nailed.",
	},
	{
		title: "Hand-finished in studio",
		description: "Sanded, oiled and upholstered by a small atelier — never on a factory line.",
	},
	{
		title: "12-year craft warranty",
		description: "Joinery and upholstery guaranteed for a decade plus two. Free repairs in years 1–3.",
	},
];

const defaultIcons = [Leaf, Hammer, Award];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-20 border-t border-[#1f2933]/10 pt-16">
			<div className="text-center max-w-2xl mx-auto">
				<div className="text-[11px] uppercase tracking-[0.22em] text-[#c8a57a] mb-3">— Behind the piece</div>
				<h2 className="font-display text-3xl sm:text-4xl tracking-[-0.015em] text-[#1f2933]">
					Crafted with intention
				</h2>
			</div>
			<div className="mt-12 grid gap-6 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div
							key={feature.title}
							className="group rounded-2xl border border-[#1f2933]/10 bg-[#f5f1ea]/50 p-6"
						>
							<div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#1f2933] transition-colors group-hover:bg-[#e89b3c]">
								<Icon className="h-5 w-5 text-[#f5f1ea] transition-colors group-hover:text-[#1f2933]" />
							</div>
							<h3 className="font-display text-xl text-[#1f2933]">{feature.title}</h3>
							<p className="mt-2 text-sm text-[#1f2933]/60 leading-relaxed">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
