const benefits = [
	{
		emoji: "⚡",
		title: "5x faster absorption",
		body: "Sublingual strips bypass digestion so actives hit your bloodstream in seconds — not 45 minutes.",
	},
	{
		emoji: "🌱",
		title: "Clinically dosed actives",
		body: "Every formula is built with research-backed amounts. No fairy dust, no proprietary blends.",
	},
	{
		emoji: "💼",
		title: "Pocket-size pack",
		body: "Slimmer than a stick of gum. Toss it in your bag, your jeans, your gym shorts.",
	},
	{
		emoji: "🍓",
		title: "Tastes like candy",
		body: "Real fruit flavors, zero sugar, zero chalky aftertaste. Your tongue won't believe it.",
	},
];

export function Benefits() {
	return (
		<section className="bg-[#fef7f0]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start">
					<div className="lg:sticky lg:top-32">
						<p className="font-marker text-[#f4884a] text-xl mb-3 -rotate-2">why everyone&apos;s switching</p>
						<h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#1a0f4d] leading-tight">
							Smaller dose, <span className="font-marker text-[#4b1fb5] inline-block -rotate-1">bigger</span>{" "}
							results.
						</h2>
						<p className="mt-6 text-[#1a0f4d]/70 text-base leading-relaxed">
							Capsules and gummies lose up to 80% of their actives in your gut. Strips melt under your tongue
							and absorb directly — so every milligram counts.
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{benefits.map((b) => (
							<div
								key={b.title}
								className="group relative rounded-3xl bg-white border-2 border-[#ecd9c6] p-6 hover:border-[#4b1fb5] hover:shadow-[0_8px_0_#4b1fb5] hover:-translate-y-1 transition-all"
							>
								<span className="text-4xl mb-3 inline-block transition-transform group-hover:scale-110 group-hover:rotate-6">
									{b.emoji}
								</span>
								<h3 className="text-lg font-extrabold text-[#1a0f4d] mb-2">{b.title}</h3>
								<p className="text-sm text-[#1a0f4d]/70 leading-relaxed">{b.body}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
