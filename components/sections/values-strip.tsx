const values = [
	{
		title: "Skin-Safe Silicone",
		body: "Hypoallergenic, medical-grade and tested for every shade and size.",
	},
	{
		title: "Reusable, Reliable",
		body: "Designed to be re-worn — gentle on the planet, gentler on you.",
	},
	{
		title: "Real-Body Tested",
		body: "From AA to KK, from yoga to swim — fit-tested by humans, not algorithms.",
	},
	{
		title: "Shipped in Pink",
		body: "Discreet, beautiful packaging that arrives at your door in 2 days.",
	},
];

export function ValuesStrip() {
	return (
		<section className="bg-blush-soft">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-10">
					{values.map((v) => (
						<div key={v.title} className="flex flex-col gap-2">
							<span className="font-display text-xl text-foreground tracking-tight">{v.title}</span>
							<p className="text-[14px] leading-relaxed text-foreground/70">{v.body}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
