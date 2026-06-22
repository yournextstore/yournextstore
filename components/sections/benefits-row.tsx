const benefits = [
	{
		title: "Good For You",
		copy: "Dermatologist-tested formulas. No dyes, no parabens, no synthetic fragrance. Hypoallergenic from rinse to dry.",
		icon: (
			<svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
				<path
					d="M24 8c4 4 10 6 14 6v10c0 9-6 14-14 16C16 38 10 33 10 24V14c4 0 10-2 14-6Z"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinejoin="round"
				/>
				<path
					d="m18 24 4 4 8-9"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
	},
	{
		title: "Good For Your Clothes",
		copy: "Plant-derived enzymes lift stains while protecting fibers — colors stay deep, whites stay bright, fabrics last longer.",
		icon: (
			<svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
				<path
					d="M14 8h20l-2 6 6 4v22H10V18l6-4-2-6Z"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinejoin="round"
				/>
				<path d="M18 8a6 6 0 0 0 12 0" stroke="currentColor" strokeWidth="2" />
			</svg>
		),
	},
	{
		title: "Good For The Planet",
		copy: "Refillable aluminum bottles. Carbon-neutral shipping. Every order pulls 5 lbs of plastic from the ocean.",
		icon: (
			<svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
				<circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2" />
				<path d="M8 24c10-6 22 6 32 0M24 8c-6 10 6 22 0 32" stroke="currentColor" strokeWidth="2" />
			</svg>
		),
	},
];

export function BenefitsRow() {
	return (
		<section className="bg-[#F5EFE6] text-[#1F2A33]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="text-center max-w-xl mx-auto mb-14">
					<p className="uppercase tracking-[0.24em] text-xs text-[#6B92AC] font-semibold mb-3">
						Why You&apos;ll Love It
					</p>
					<h2 className="headline-display text-3xl sm:text-4xl lg:text-5xl text-[#1F2A33]">
						Clean that works as hard as you do
					</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
					{benefits.map((b) => (
						<div
							key={b.title}
							className="rounded-3xl bg-white border border-[#E0D5C1] p-8 lg:p-10 shadow-[0_1px_0_rgba(0,0,0,0.02)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
						>
							<div className="w-14 h-14 rounded-2xl bg-[#8FB1C7]/15 text-[#1F2A33] flex items-center justify-center mb-6">
								<div className="w-8 h-8">{b.icon}</div>
							</div>
							<h3 className="headline-display text-xl sm:text-2xl mb-3 text-[#1F2A33]">{b.title}</h3>
							<p className="text-[#3B4856] leading-relaxed">{b.copy}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
