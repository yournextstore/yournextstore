const ingredients = [
	{ name: "Plant Enzymes", desc: "Lift stains naturally" },
	{ name: "Coconut Surfactants", desc: "Deep, gentle clean" },
	{ name: "Aloe Extract", desc: "Soothes sensitive skin" },
	{ name: "Eucalyptus Oil", desc: "Calming, fresh scent" },
	{ name: "Citrus Brighteners", desc: "Lifts whites" },
	{ name: "Ocean Minerals", desc: "Softens water" },
];

export function Ingredients() {
	return (
		<section className="bg-[#EAE0CF] text-[#1F2A33]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-20 items-center">
					<div>
						<p className="uppercase tracking-[0.24em] text-xs text-[#6B92AC] font-semibold mb-3">
							The Formula
						</p>
						<h2 className="headline-display text-3xl sm:text-4xl lg:text-5xl leading-[0.95] mb-6">
							Six ingredients.
							<br />
							Zero compromises.
						</h2>
						<p className="text-[#3B4856] text-base sm:text-lg leading-relaxed max-w-md">
							We list every ingredient, in plain English, with a reason for being there. No surprise
							chemicals. No greenwashed labels. Just what works.
						</p>
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
						{ingredients.map((ing, i) => (
							<div
								key={ing.name}
								className="aspect-square rounded-2xl bg-[#F5EFE6] p-4 sm:p-5 flex flex-col justify-between border border-[#E0D5C1] hover:bg-white transition-colors group"
							>
								<div className="text-3xl sm:text-4xl headline-display text-[#8FB1C7]/40 group-hover:text-[#6B92AC] transition-colors">
									0{i + 1}
								</div>
								<div>
									<p className="text-sm sm:text-base font-semibold leading-tight">{ing.name}</p>
									<p className="text-xs sm:text-sm text-[#3B4856] mt-1">{ing.desc}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
