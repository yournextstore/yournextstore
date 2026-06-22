import Image from "next/image";

const PILLARS = [
	{
		title: "Lab-tested",
		body: "Every batch screened for heavy metals, pesticides and active beta-glucans.",
	},
	{
		title: "Regenerative",
		body: "Grown on hardwood logs in cleared chestnut forests — restoring soil and shade.",
	},
	{
		title: "Single-origin",
		body: "Harvested by our small team at the foot of the Serra da Estrela, Portugal.",
	},
];

export function About() {
	return (
		<section id="about" className="relative bg-[color:var(--color-mush-cream)] overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
					<div className="relative">
						<div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-[color:var(--color-mush-espresso)]">
							<Image
								src="/scraped-0.jpg"
								alt="Hand-harvested lion's mane mushroom"
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-mush-espresso)]/40 to-transparent" />
						</div>
						<div className="absolute -bottom-6 -right-4 sm:-right-8 max-w-[240px] rounded-2xl bg-[color:var(--color-mush-yellow)] p-5 shadow-[0_15px_40px_rgba(61,31,15,0.25)] rotate-2">
							<p className="font-script text-xl text-[color:var(--color-mush-espresso)] leading-tight">
								Hand-picked
							</p>
							<p className="font-display text-xs tracking-[0.2em] uppercase text-[color:var(--color-mush-espresso)] mt-1">
								By our farmers
							</p>
						</div>
					</div>

					<div>
						<p className="font-script text-3xl text-[color:var(--color-mush-caramel)]">Our story</p>
						<h2 className="mt-2 font-display text-4xl sm:text-5xl text-[color:var(--color-mush-espresso)] leading-[1.05]">
							Forest-grown
							<br />
							for daily rituals.
						</h2>
						<p className="mt-6 text-lg text-[color:var(--color-mush-espresso)]/80 leading-relaxed">
							We&apos;re a tiny apothecary cultivating functional mushrooms the old way — on logs, under
							canopy, at nature&apos;s pace. No filler, no shortcuts, no nonsense. Just thoughtfully
							concentrated tinctures and powders that earn a place in your morning.
						</p>
						<dl className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
							{PILLARS.map((p) => (
								<div
									key={p.title}
									className="rounded-2xl border border-[color:var(--color-mush-cream-deep)] bg-white p-5"
								>
									<dt className="font-display text-sm tracking-[0.18em] uppercase text-[color:var(--color-mush-espresso)]">
										{p.title}
									</dt>
									<dd className="mt-2 text-sm text-[color:var(--color-mush-espresso)]/70 leading-relaxed">
										{p.body}
									</dd>
								</div>
							))}
						</dl>
					</div>
				</div>
			</div>
		</section>
	);
}
