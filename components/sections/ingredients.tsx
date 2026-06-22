import Image from "next/image";

const ingredients = [
	{
		name: "Calabrian Chili",
		origin: "Calabria, IT",
		image: "/scraped-1.jpg",
		note: "Sun-fermented for 90 days.",
	},
	{
		name: "San Marzano Tomato",
		origin: "Campania, IT",
		image: "/scraped-2.jpg",
		note: "Hand-crushed at peak ripeness.",
	},
	{
		name: "Sicilian Sea Salt",
		origin: "Trapani, IT",
		image: "/scraped-3.jpg",
		note: "Drawn from coastal salt pans.",
	},
	{
		name: "Wild Oregano",
		origin: "Puglia, IT",
		image: "/scraped-4.jpg",
		note: "Cured under terracotta tiles.",
	},
];

export function Ingredients() {
	return (
		<section className="relative overflow-hidden bg-[color:#0f2a3f] py-20 text-[color:#f6efe2] lg:py-28">
			{/* Drape backdrop */}
			<div
				aria-hidden="true"
				className="absolute inset-0 opacity-30"
				style={{
					backgroundImage:
						"repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 40px), radial-gradient(at 80% 20%, rgba(238,122,26,0.20), transparent 55%)",
				}}
			/>

			<div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10">
				<div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[1fr_1fr]">
					<div>
						<p className="divider-ornament text-[color:#c9b79b]">From Field to Bottle</p>
						<h2 className="mt-5 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-[56px]">
							Provenance you can <span className="italic text-[color:#ee7a1a]">taste.</span>
						</h2>
					</div>
					<p className="max-w-md text-base leading-relaxed text-[color:#c9b79b] sm:text-lg">
						We work directly with seven family-run farms across southern Italy. Every harvest is dated,
						photographed, and signed. Nothing in the bottle that wasn&apos;t in the soil six months ago.
					</p>
				</div>

				<div className="-mx-4 mt-14 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
					<ol className="flex min-w-max gap-6">
						{ingredients.map((ing, i) => (
							<li
								key={ing.name}
								className="group relative w-72 shrink-0 overflow-hidden rounded-sm border border-white/10 bg-white/5 backdrop-blur-sm"
							>
								<div className="relative aspect-[4/5] overflow-hidden">
									<Image
										src={ing.image}
										alt={ing.name}
										fill
										sizes="288px"
										className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-[#0f2a3f] via-transparent to-transparent" />
									<span className="absolute left-4 top-4 font-display text-sm italic text-[color:#c9b79b]">
										N° 0{i + 1}
									</span>
								</div>
								<div className="space-y-1 px-5 py-5">
									<h3 className="font-display text-2xl text-[color:#f6efe2]">{ing.name}</h3>
									<p className="text-xs uppercase tracking-[0.18em] text-[color:#ee7a1a]">{ing.origin}</p>
									<p className="pt-2 text-sm text-[color:#c9b79b]/90">{ing.note}</p>
								</div>
							</li>
						))}
					</ol>
				</div>
			</div>
		</section>
	);
}
