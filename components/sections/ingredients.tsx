import Image from "next/image";

const ingredients = [
	{
		name: "Lemon Eucalyptus",
		short: "Citriodiol",
		blurb: "Clinically proven repellent oil pressed from young eucalyptus leaves at high altitude.",
		hue: "#1f5b2a",
	},
	{
		name: "Citronella",
		short: "Cymbopogon",
		blurb: "Bright lemongrass-cousin terpenes that mask the CO₂ trail biters love to follow.",
		hue: "#f5c518",
	},
	{
		name: "Peppermint",
		short: "Mentha piperita",
		blurb: "Cooling menthol that lifts the formula and confuses chemoreceptors on contact.",
		hue: "#e63027",
	},
	{
		name: "Geranium",
		short: "Pelargonium",
		blurb: "Floral, slightly rosy notes that round out the scent so you don’t smell like a candle.",
		hue: "#f2a93b",
	},
];

export function Ingredients() {
	return (
		<section className="bg-[var(--tropic-cream)] text-[#15323b]">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
				<div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
					<div className="lg:col-span-5 relative">
						<div className="relative aspect-square rounded-[40px] overflow-hidden bg-[var(--tropic-green)]">
							<Image
								src="/scraped-1.jpg"
								alt="Botanical ingredients flat lay"
								fill
								sizes="(max-width: 1024px) 100vw, 40vw"
								className="object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-tr from-[var(--tropic-green)]/20 to-transparent" />
							<div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
								<span className="font-display italic text-white text-2xl">Honest formulas</span>
								<span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#15323b]">
									0% DEET
								</span>
							</div>
						</div>

						<div className="absolute -top-6 -right-6 hidden sm:flex h-28 w-28 rounded-full bg-[var(--tropic-yellow)] text-[#15323b] flex-col items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.15)] rotate-[-8deg]">
							<span className="font-display italic text-2xl leading-none">Made</span>
							<span className="font-display italic text-2xl leading-none">with</span>
							<span className="font-display italic text-2xl leading-none">care</span>
						</div>
					</div>

					<div className="lg:col-span-7">
						<span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-[var(--tropic-red)] font-semibold">
							<span className="h-px w-8 bg-[var(--tropic-red)]" />
							Ingredients
						</span>
						<h2 className="font-display italic mt-3 text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight">
							Six plants.
							<br />
							Zero compromises.
						</h2>
						<p className="mt-4 text-base sm:text-lg text-[#486870] leading-relaxed max-w-xl">
							Every Your Next Store formula starts with food-grade botanicals harvested from regenerative
							farms. We test for performance and skin-feel until both pass — never one without the other.
						</p>

						<div className="mt-10 grid sm:grid-cols-2 gap-4">
							{ingredients.map((ing) => (
								<div
									key={ing.name}
									className="rounded-2xl border border-[#e6d6b1] bg-white p-5 hover:-translate-y-0.5 hover:shadow-[0_18px_30px_rgba(0,0,0,0.08)] transition-all"
								>
									<div className="flex items-center gap-3">
										<span
											className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white text-sm font-semibold"
											style={{ backgroundColor: ing.hue }}
										>
											{ing.name.charAt(0)}
										</span>
										<div>
											<div className="font-display text-lg leading-none">{ing.name}</div>
											<div className="mt-1 text-[11px] uppercase tracking-[0.22em] text-[#486870]">
												{ing.short}
											</div>
										</div>
									</div>
									<p className="mt-3 text-sm text-[#486870] leading-relaxed">{ing.blurb}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
