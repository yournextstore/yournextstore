import Image from "next/image";

const VALUES = [
	{
		title: "Made by hand",
		body: "Every piece is shaped by a single maker — wheel-thrown, hand-loomed or carved in our atelier in Puglia.",
	},
	{
		title: "Low-impact materials",
		body: "Stone offcuts, undyed linen, unfired clay — we choose materials that age into a softer second life.",
	},
	{
		title: "Lifetime repair",
		body: "Cracks, fraying, a knocked-out tile — send it back and we will mend it, for as long as you have it.",
	},
];

export function MaterialCraft() {
	return (
		<section className="bg-aura-cream py-20 sm:py-28">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-center">
					{/* Left: craft photo + caption */}
					<figure className="relative">
						<div className="relative aspect-[4/5] overflow-hidden rounded-md bg-sand">
							<Image
								src="/scraped-3.jpg"
								alt="Hands shaping a hand-glazed clay vessel in afternoon studio light"
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover"
							/>
							<div
								aria-hidden="true"
								className="absolute inset-0 bg-gradient-to-t from-walnut/15 to-transparent"
							/>
						</div>
						<figcaption className="mt-4 flex items-baseline justify-between text-[11px] uppercase tracking-[0.22em] text-espresso/55">
							<span>Studio · Ostuni</span>
							<span>Plate iv · spring</span>
						</figcaption>

						{/* Floating quote card */}
						<div className="hidden lg:flex absolute -bottom-8 -right-8 max-w-xs bg-cream border border-border rounded-md p-6 shadow-xl flex-col gap-3">
							<p className="font-serif italic text-walnut text-lg leading-snug">
								&ldquo;The clay decides where the next ridge will fall — I just hold the wheel.&rdquo;
							</p>
							<p className="text-[11px] uppercase tracking-[0.22em] text-clay">— Marco, lead ceramist</p>
						</div>
					</figure>

					{/* Right: values */}
					<div>
						<p className="text-[11px] uppercase tracking-[0.32em] text-clay/80 mb-4">Our practice</p>
						<h2 className="font-serif text-3xl sm:text-5xl text-walnut tracking-tight leading-[1.05] text-balance">
							A few materials,
							<br />
							held with <span className="italic text-clay">care</span>.
						</h2>
						<p className="mt-6 max-w-md text-base text-espresso/70 leading-relaxed">
							We work with three or four materials at a time — only what we can shape ourselves, in quantities
							small enough to keep an eye on every edge.
						</p>

						<ul className="mt-12 divide-y divide-border/70 border-y border-border/70">
							{VALUES.map((value, i) => (
								<li key={value.title} className="py-6 grid grid-cols-[auto_1fr] gap-6 items-baseline">
									<span className="font-serif text-2xl text-clay tabular-nums">0{i + 1}</span>
									<div>
										<h3 className="font-serif text-xl text-walnut">{value.title}</h3>
										<p className="mt-1.5 text-sm text-espresso/65 leading-relaxed max-w-md">{value.body}</p>
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
}
