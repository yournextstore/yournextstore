import Image from "next/image";
import { YnsLink } from "../yns-link";

const recipes = [
	{
		image: "/scraped-1.jpg",
		eyebrow: "Recipe 01",
		title: "Reaper Carbonara",
		body: "Guanciale, three yolks, a heretical dollop of our Red Wine & Reaper. Ready in 12 minutes flat.",
		time: "12 min",
		heat: "9/10",
	},
	{
		image: "/scraped-2.jpg",
		eyebrow: "Recipe 02",
		title: "Burnt Onion Bucatini",
		body: "Caramelize onions until they confess. Toss with bucatini and our slow-simmered marinara.",
		time: "25 min",
		heat: "4/10",
	},
	{
		image: "/scraped-4.jpg",
		eyebrow: "Recipe 03",
		title: "Three-Jar Sunday Sauce",
		body: "All three sauces, one pot, a Sunday afternoon. Feeds eight. Argues with twelve.",
		time: "3 hrs",
		heat: "6/10",
	},
];

export function RecipeFeature() {
	return (
		<section id="recipes" className="relative bg-cream text-soot overflow-hidden">
			<div
				aria-hidden
				className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blush/40 blur-3xl pointer-events-none"
			/>
			<div
				aria-hidden
				className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-flame/30 blur-3xl pointer-events-none"
			/>
			<div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-20 sm:py-28">
				<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
					<div>
						<span className="inline-flex items-center gap-3 text-[11px] font-condensed tracking-[0.32em] text-ember">
							<span aria-hidden className="h-px w-10 bg-ember/60" />
							Eat With Us
						</span>
						<h2 className="mt-4 font-display text-5xl sm:text-6xl leading-[1.02]">From The Kitchen</h2>
					</div>
					<p className="max-w-sm text-muted-foreground text-base">
						Three weeknight rituals from the YNS test kitchen. No special equipment. No nonna&apos;s
						permission.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
					{recipes.map((r, i) => (
						<article
							key={r.title}
							className="group relative bg-background border border-soot/10 overflow-hidden hover:border-ember/40 transition-colors"
						>
							<div className="relative aspect-[4/5] overflow-hidden">
								<Image
									src={r.image}
									alt={r.title}
									fill
									sizes="(max-width: 768px) 100vw, 33vw"
									className="object-cover transition-transform duration-700 group-hover:scale-105"
								/>
								<div
									aria-hidden
									className="absolute inset-0 bg-gradient-to-t from-soot/80 via-soot/0 to-transparent"
								/>
								<span className="absolute top-4 left-4 font-condensed text-[10px] tracking-[0.32em] text-cream/80">
									{r.eyebrow}
								</span>
								<div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-condensed text-[10px] tracking-[0.22em] text-cream/90">
									<span>⏱ {r.time}</span>
									<span>🌶 {r.heat}</span>
								</div>
							</div>
							<div className="p-6">
								<h3 className="font-display text-3xl text-soot leading-none">{r.title}</h3>
								<p className="mt-3 text-sm text-muted-foreground leading-relaxed">{r.body}</p>
								<YnsLink
									href="#"
									className="mt-5 inline-flex items-center gap-2 font-condensed text-[11px] tracking-[0.28em] text-ember"
								>
									Read Recipe →
								</YnsLink>
							</div>
							<span
								aria-hidden
								className="absolute top-4 right-4 font-display text-3xl text-cream/40 mix-blend-overlay"
							>
								{String(i + 1).padStart(2, "0")}
							</span>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
