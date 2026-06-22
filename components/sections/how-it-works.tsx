const steps = [
	{
		number: "01",
		title: "Tear",
		description: "Open the slim pocket-size pack — no water, no pills, no fuss.",
		color: "#f5c518",
	},
	{
		number: "02",
		title: "Place",
		description: "Drop one melt-in-mouth strip on your tongue. It dissolves in seconds.",
		color: "#f4884a",
	},
	{
		number: "03",
		title: "Glow",
		description: "Clinically-dosed actives absorb fast, so you feel it before the minute is up.",
		color: "#4b1fb5",
	},
];

export function HowItWorks() {
	return (
		<section className="bg-[#4b1fb5] text-white overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="text-center mb-16 max-w-2xl mx-auto">
					<p className="font-marker text-[#f5c518] text-xl mb-3 -rotate-2">how it works</p>
					<h2 className="text-3xl sm:text-4xl lg:text-5xl text-white">
						One strip. <span className="text-[#f5c518]">Sixty seconds.</span>
					</h2>
					<p className="mt-4 text-white/70 text-base">
						No swallowing horse pills or stirring sad powder. Just unwrap, place, and go.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{steps.map((s, i) => (
						<div
							key={s.number}
							className="relative rounded-[2rem] bg-white/5 backdrop-blur-sm border border-white/10 p-8"
						>
							<span
								className="font-marker text-7xl absolute -top-6 -left-2 rotate-[-8deg] drop-shadow-[2px_3px_0_rgba(0,0,0,0.2)]"
								style={{ color: s.color }}
							>
								{s.number}
							</span>
							<div className="mt-10">
								<h3 className="text-2xl font-extrabold text-white mb-3">{s.title}</h3>
								<p className="text-white/70 text-sm leading-relaxed">{s.description}</p>
							</div>
							{i < steps.length - 1 && (
								<svg
									aria-hidden="true"
									viewBox="0 0 80 12"
									className="hidden md:block absolute top-1/2 -right-8 w-16 h-3 -translate-y-1/2 text-[#f5c518]"
									fill="none"
								>
									<path
										d="M2 6 Q 20 0 40 6 T 78 6"
										stroke="currentColor"
										strokeWidth="2"
										strokeDasharray="2 4"
										strokeLinecap="round"
									/>
								</svg>
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
