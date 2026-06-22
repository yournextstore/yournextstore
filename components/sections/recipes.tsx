import Image from "next/image";

const pairings = [
	{
		title: "Margherita, but louder",
		dish: "Wood-fired pizza",
		image: "/scraped-1.jpg",
		drizzle: "Two teaspoons. Right before serving.",
	},
	{
		title: "Cacio e Fuoco",
		dish: "Pecorino tagliolini",
		image: "/scraped-2.jpg",
		drizzle: "Finish the pan. Stir once.",
	},
	{
		title: "Sunday eggs",
		dish: "Soft scramble · sourdough",
		image: "/scraped-3.jpg",
		drizzle: "On top. Always.",
	},
	{
		title: "Oysters on ice",
		dish: "Briny, raw, freezing cold",
		image: "/scraped-4.jpg",
		drizzle: "A single drop. Then another.",
	},
];

export function Recipes() {
	return (
		<section className="relative overflow-hidden bg-cream-paper py-20 lg:py-28">
			<div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10">
				<div className="flex flex-col items-center text-center">
					<p className="divider-ornament">Pour. Drizzle. Devour.</p>
					<h2 className="mt-5 font-display text-4xl tracking-tight text-[color:#0f2a3f] sm:text-5xl lg:text-[56px]">
						Four ways to <span className="italic text-[color:#7c1f12]">set the table on fire.</span>
					</h2>
				</div>

				<div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
					{pairings.map((p, i) => (
						<article
							key={p.title}
							className="group rotate-[-1deg] border border-[color:#0f2a3f]/10 bg-[color:#fdf8ec] p-3 shadow-[0_18px_36px_-18px_rgba(15,42,63,0.35)] transition-transform duration-500 hover:rotate-0 hover:-translate-y-1 even:rotate-[1deg]"
							style={{ transformOrigin: i % 2 === 0 ? "left center" : "right center" }}
						>
							<div className="relative aspect-square overflow-hidden bg-[color:#0f2a3f]">
								<Image
									src={p.image}
									alt={p.dish}
									fill
									sizes="(max-width: 640px) 100vw, 25vw"
									className="object-cover transition-transform duration-700 group-hover:scale-105"
								/>
								<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
								<span className="absolute right-3 top-3 rounded-full bg-[color:#ee7a1a] px-2.5 py-1 font-display text-[10px] uppercase tracking-[0.2em] text-[color:#fff8ec]">
									N° {i + 1}
								</span>
							</div>
							<div className="px-2 pb-3 pt-4 text-center">
								<h3 className="font-display text-2xl text-[color:#0f2a3f]">{p.title}</h3>
								<p className="mt-1 text-xs uppercase tracking-[0.18em] text-[color:#7c1f12]">{p.dish}</p>
								<p className="mt-3 font-display text-sm italic text-[color:#0f2a3f]/70">{p.drizzle}</p>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
