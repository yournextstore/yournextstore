import { Droplets, Leaf, Sparkles } from "lucide-react";

const benefits = [
	{
		icon: Leaf,
		title: "Aloe Vera Infused",
		description: "Hand-pressed aloe leaf for a cooling sip that soothes from the first crisp pour.",
	},
	{
		icon: Sparkles,
		title: "Prebiotic Fibers",
		description: "Gut-friendly fibers that keep things glowing on the inside, where it counts.",
	},
	{
		icon: Droplets,
		title: "All-Natural",
		description: "No artificial sweeteners, no syrupy fillers — just bright, botanical flavor.",
	},
];

export function Benefits() {
	return (
		<section className="relative bg-[#fbf6ec] border-y border-[#0f0f10]/8">
			<div aria-hidden="true" className="absolute inset-0 yns-grain opacity-30" />
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="grid gap-10 sm:gap-6 md:grid-cols-3">
					{benefits.map((b) => {
						const Icon = b.icon;
						return (
							<div key={b.title} className="flex flex-col items-center text-center px-2">
								<div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#e11226]/30 bg-[#fbf6ec] shadow-[0_2px_0_rgba(225,18,38,0.15)]">
									<Icon className="h-7 w-7 text-[#e11226]" strokeWidth={1.5} />
								</div>
								<h3 className="font-serif text-2xl text-[#0f0f10] italic">{b.title}</h3>
								<p className="mt-3 max-w-xs text-sm leading-relaxed text-[#0f0f10]/65">{b.description}</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
