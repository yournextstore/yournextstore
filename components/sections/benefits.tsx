import { BrainIcon, FlameIcon, HeartPulseIcon, MoonStarIcon } from "lucide-react";

const pillars = [
	{
		icon: BrainIcon,
		label: "Cognition",
		copy: "Lion's mane supports nerve growth factor and mental clarity through the afternoon slump.",
	},
	{
		icon: FlameIcon,
		label: "Inflammation",
		copy: "Reishi and chaga deliver triterpenes and polysaccharides that calm systemic stress.",
	},
	{
		icon: HeartPulseIcon,
		label: "Anxiety",
		copy: "Adaptogenic blends modulate cortisol so your baseline shifts toward steady.",
	},
	{
		icon: MoonStarIcon,
		label: "Sleep",
		copy: "Magnesium-rich reishi paired with L-theanine for deeper, less interrupted nights.",
	},
];

export function Benefits() {
	return (
		<section className="bg-[#f5efe3]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="text-center max-w-xl mx-auto mb-16">
					<p className="font-label text-clay" style={{ color: "#8b7560" }}>
						FOUR DAILY PILLARS
					</p>
					<h2 className="font-editorial text-3xl sm:text-4xl font-medium text-foreground mt-4 leading-[1.1]">
						Built for how you actually feel
					</h2>
				</div>
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
					{pillars.map((p) => (
						<div key={p.label} className="text-center px-2">
							<div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#d6c8af] bg-[#fffaf0]">
								<p.icon className="h-6 w-6 text-[#4a5bc4]" strokeWidth={1.5} />
							</div>
							<h3 className="font-editorial text-lg font-medium text-foreground">{p.label}</h3>
							<p className="mt-2 text-sm text-foreground/65 leading-relaxed">{p.copy}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
