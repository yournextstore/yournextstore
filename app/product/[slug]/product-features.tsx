import { Droplets, Leaf, type LucideIcon, Sparkles } from "lucide-react";

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
		title: "Aloe Vera Infused",
		description: "Hand-pressed aloe leaf for a cooling, soothing sip from the first crisp pour.",
	},
	{
		title: "Prebiotic Fibers",
		description: "Gut-friendly fibers that keep things glowing on the inside, where it counts.",
	},
	{
		title: "All-Natural",
		description: "No artificial sweeteners, no syrupy fillers — just bright, botanical flavor.",
	},
];

const defaultIcons = [Leaf, Sparkles, Droplets];

export function ProductFeatures({ features = defaultFeatures }: ProductFeaturesProps) {
	return (
		<section className="mt-24 border-t border-[#0f0f10]/10 pt-16">
			<div className="text-center mb-14">
				<p className="text-[11px] tracking-[0.4em] uppercase text-[#e11226] font-semibold">
					Why you&apos;ll love it
				</p>
				<h2 className="mt-3 font-serif text-4xl sm:text-5xl text-[#0f0f10] tracking-tight">
					Brewed with <span className="italic text-[#e11226]">intention</span>.
				</h2>
			</div>
			<div className="grid gap-12 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon ?? defaultIcons[index % defaultIcons.length];
					return (
						<div key={feature.title} className="group flex flex-col items-center text-center">
							<div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#e11226]/30 bg-[#fbf6ec] transition-colors group-hover:bg-[#e11226]">
								<Icon
									className="h-7 w-7 text-[#e11226] transition-colors group-hover:text-[#fbf6ec]"
									strokeWidth={1.5}
								/>
							</div>
							<h3 className="font-serif text-2xl italic text-[#0f0f10]">{feature.title}</h3>
							<p className="mt-3 max-w-xs text-sm text-[#0f0f10]/65 leading-relaxed">{feature.description}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
