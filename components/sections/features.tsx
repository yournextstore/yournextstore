import { Coffee, Flame, Zap } from "lucide-react";

const features = [
	{
		eyebrow: "01 / Sourcing",
		title: "Direct trade, no middlemen",
		body: "We fly to the farms, taste the beans, and pay growers more than the market price — because great coffee starts with great people.",
		icon: Coffee,
	},
	{
		eyebrow: "02 / Roast",
		title: "Dark, deliberate, daily",
		body: "Roasted in small batches at our Brooklyn warehouse. Bagged within 48 hours. Shipped before the oils settle.",
		icon: Flame,
	},
	{
		eyebrow: "03 / Attitude",
		title: "Loud as the city it's from",
		body: "We don't do flowery tasting notes. We do espresso that hits like a kick-flip off a concrete plinth.",
		icon: Zap,
	},
];

export function Features() {
	return (
		<section className="relative overflow-hidden border-y border-[#0e0e0e]/10 bg-[#0e0e0e] text-[#f2f2f2]">
			<div
				aria-hidden
				className="absolute inset-0 opacity-[0.05]"
				style={{
					backgroundImage:
						"linear-gradient(#ffcc00 1px, transparent 1px), linear-gradient(90deg, #ffcc00 1px, transparent 1px)",
					backgroundSize: "80px 80px",
				}}
			/>

			<div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-28">
				<div className="mb-14 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
					<div>
						<span className="jolt-eyebrow text-[#ffcc00]">— Why Your Next Store</span>
						<h2 className="jolt-headline mt-3 text-4xl sm:text-5xl lg:text-6xl text-white max-w-3xl">
							Three rules. Zero compromise.
						</h2>
					</div>
					<p className="max-w-xs text-sm text-white/60">
						The whole ethos in twelve words, taped to the warehouse wall.
					</p>
				</div>

				<div className="grid gap-px bg-white/10 md:grid-cols-3">
					{features.map((feature) => {
						const Icon = feature.icon;
						return (
							<div
								key={feature.eyebrow}
								className="group relative bg-[#0e0e0e] p-8 sm:p-10 transition-colors hover:bg-[#1a1a1a]"
							>
								<div className="flex items-center justify-between">
									<span className="jolt-eyebrow text-[#ffcc00]">{feature.eyebrow}</span>
									<Icon className="h-5 w-5 text-white/40 transition-colors group-hover:text-[#ffcc00]" />
								</div>
								<h3 className="jolt-headline mt-6 text-2xl sm:text-3xl text-white">{feature.title}</h3>
								<p className="mt-4 text-sm text-white/65 leading-relaxed">{feature.body}</p>
								<div className="mt-8 h-px w-12 bg-[#ffcc00] transition-all group-hover:w-24" />
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
