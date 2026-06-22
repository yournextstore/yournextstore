import { Dumbbell, Leaf, ShieldCheck, Sparkles } from "lucide-react";

const stats = [
	{ icon: Dumbbell, value: "30G", label: "Protein per pint", color: "var(--yns-cyan)" },
	{ icon: Leaf, value: "Low", label: "Sugar, real ingredients", color: "var(--yns-mint)" },
	{ icon: ShieldCheck, value: "0", label: "Sketchy fillers, ever", color: "var(--yns-honey)" },
	{ icon: Sparkles, value: "High", label: "Fiber & probiotics", color: "var(--yns-peach)" },
];

export function Macros() {
	return (
		<section className="bg-black border-y border-white/10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
					{stats.map((stat) => {
						const Icon = stat.icon;
						return (
							<div key={stat.label} className="flex flex-col items-center text-center">
								<div
									className="flex h-14 w-14 items-center justify-center rounded-full"
									style={{ background: stat.color }}
								>
									<Icon className="h-6 w-6 text-black" strokeWidth={2.5} />
								</div>
								<div className="mt-5 font-display uppercase text-4xl sm:text-5xl text-white">
									{stat.value}
								</div>
								<div className="mt-2 text-xs sm:text-sm uppercase tracking-[0.18em] text-white/60">
									{stat.label}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
