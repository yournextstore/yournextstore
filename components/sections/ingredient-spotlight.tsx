type Ingredient = {
	name: string;
	blurb: string;
	bg: string;
	emoji: string;
};

const INGREDIENTS: Ingredient[] = [
	{
		name: "Hemp Hearts",
		blurb: "Complete plant protein with a buttery, nutty finish.",
		bg: "#a8e0dc",
		emoji: "🌱",
	},
	{
		name: "Nutritional Yeast",
		blurb: "Cheesy, golden flakes packed with B-vitamins.",
		bg: "#f5a623",
		emoji: "🧀",
	},
	{
		name: "Roasted Garlic",
		blurb: "Slow-roasted for deep umami without the bite.",
		bg: "#9f9cf5",
		emoji: "🧄",
	},
	{
		name: "Sea Flakes",
		blurb: "Hand-harvested mineral salt for a clean crunch.",
		bg: "#f5cba7",
		emoji: "🧂",
	},
];

export function IngredientSpotlight() {
	return (
		<section className="bg-[#fbe9d7] border-t border-[#1b2a2e]/10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="text-center max-w-2xl mx-auto">
					<span className="inline-flex items-center gap-2 rounded-full border border-[#1b2a2e]/15 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1b2a2e]">
						<span className="h-1.5 w-1.5 rounded-full bg-[#f5a623]" />
						What&apos;s inside
					</span>
					<h2 className="mt-4 font-display text-3xl sm:text-5xl font-black tracking-tight text-[#1b2a2e]">
						Four ingredients. <em className="text-[#9f9cf5] not-italic">Zero filler.</em>
					</h2>
					<p className="mt-4 text-base sm:text-lg text-[#1b2a2e]/70">
						Every scoop is built from whole-food essentials that pull double-duty: flavor first, function
						close behind.
					</p>
				</div>

				<div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
					{INGREDIENTS.map((ing) => (
						<div key={ing.name} className="flex flex-col items-center text-center">
							<div
								className="relative flex h-36 w-36 sm:h-40 sm:w-40 items-center justify-center rounded-full shadow-[0_25px_40px_-20px_rgba(27,42,46,0.4)] transition-transform hover:scale-105"
								style={{ backgroundColor: ing.bg }}
							>
								<div className="absolute inset-3 rounded-full border-2 border-dashed border-[#1b2a2e]/30" />
								<span className="text-5xl" aria-hidden="true">
									{ing.emoji}
								</span>
							</div>
							<h3 className="mt-5 font-display text-xl font-bold text-[#1b2a2e]">{ing.name}</h3>
							<p className="mt-2 text-sm text-[#1b2a2e]/70 leading-relaxed max-w-[20ch]">{ing.blurb}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
