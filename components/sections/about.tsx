import Image from "next/image";
import { YnsLink } from "../yns-link";

const ELECTROLYTES = [
	{ symbol: "Na", name: "Sodium", value: "380mg", desc: "Restores plasma volume after heavy sweat loss." },
	{ symbol: "K", name: "Potassium", value: "210mg", desc: "Supports muscle contraction and cardiac rhythm." },
	{ symbol: "Mg", name: "Magnesium", value: "95mg", desc: "Reduces cramping and aids recovery." },
	{ symbol: "Cl", name: "Chloride", value: "440mg", desc: "Balances acid-base chemistry during exertion." },
];

const ATHLETES = [
	{
		name: "Mara Olufemi",
		discipline: "Marathon · 2:21:04",
		quote: "Every mile after the wall is chemistry. Y.N.S keeps mine right when the heat tries to take it.",
		image: "/scraped-0.jpg",
	},
	{
		name: "Diego Salas",
		discipline: "Triathlon · Kona Q",
		quote: "Eight hours in the saddle. One can on the brick. Numbers stay where I left them.",
		image: "/scraped-1.jpg",
	},
	{
		name: "Imogen Bryce",
		discipline: "Track · 800m",
		quote: "I trust three things before a heat: my coach, my spikes, and Lemon Lime.",
		image: "/scraped-2.jpg",
	},
];

const PRESS = ["Runner's World", "Outside", "Bloomberg", "Men's Health", "Fast Company", "Wired"] as const;

export function About() {
	return (
		<>
			{/* SCIENCE OF HYDRATION */}
			<section id="science" className="relative granite py-24 sm:py-32 border-t border-white/5">
				<div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
					<div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-start">
						<div className="lg:sticky lg:top-32">
							<div className="text-[10px] tracking-[0.32em] uppercase text-lilac mb-6">
								— 02 / The Science
							</div>
							<h2 className="font-display font-light text-bone text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-[-0.02em]">
								Replace what you <span className="italic">sweat</span>.
							</h2>
							<p className="mt-8 text-foreground/70 text-base sm:text-lg leading-relaxed max-w-md">
								We started with a simple question. What does a half-marathon actually take out of you? Sodium,
								water, glucose — measurable, predictable, replaceable. Every can of Y.N.S is formulated to a
								24-hour endurance profile validated against real athletes in real heat.
							</p>
							<div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
								<Stat value="6" label="Electrolytes" />
								<Stat value="0g" label="Added Sugar" />
								<Stat value="NSF" label="Certified for Sport" />
							</div>
						</div>
						<div className="grid grid-cols-2 gap-px bg-white/10 rounded-2xl overflow-hidden">
							{ELECTROLYTES.map((el) => (
								<div key={el.symbol} className="bg-background p-7 sm:p-10 flex flex-col gap-5 min-h-[220px]">
									<div className="flex items-baseline justify-between">
										<div className="font-display text-5xl sm:text-6xl font-light text-bone leading-none">
											{el.symbol}
										</div>
										<div className="text-[10px] tracking-[0.25em] uppercase text-foreground/50">
											{el.value}
										</div>
									</div>
									<div className="mt-auto">
										<div className="text-[10px] tracking-[0.28em] uppercase text-lilac mb-2">{el.name}</div>
										<p className="text-sm text-foreground/60 leading-relaxed">{el.desc}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* ATHLETES */}
			<section className="relative granite py-24 sm:py-32 border-t border-white/5">
				<div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
					<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
						<div>
							<div className="text-[10px] tracking-[0.32em] uppercase text-lilac mb-6">— 03 / Athletes</div>
							<h2 className="font-display font-light text-bone text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-[-0.02em] max-w-2xl">
								Built with the people who <span className="italic">need it most</span>.
							</h2>
						</div>
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="self-start sm:self-end text-[11px] tracking-[0.25em] uppercase text-foreground/70 hover:text-bone transition-colors"
						>
							Roster →
						</YnsLink>
					</div>

					<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
						{ATHLETES.map((athlete) => (
							<figure
								key={athlete.name}
								className="group relative aspect-[4/5] rounded-xl overflow-hidden bg-secondary"
							>
								<Image
									src={athlete.image}
									alt={athlete.name}
									fill
									sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
									className="object-cover transition-transform duration-1000 group-hover:scale-105"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
								<figcaption className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
									<blockquote className="font-display italic text-bone text-lg sm:text-xl leading-snug">
										“{athlete.quote}”
									</blockquote>
									<div className="mt-5 flex items-baseline justify-between border-t border-white/15 pt-4">
										<div className="text-bone text-sm font-medium tracking-wide">{athlete.name}</div>
										<div className="text-[10px] tracking-[0.22em] uppercase text-foreground/60">
											{athlete.discipline}
										</div>
									</div>
								</figcaption>
							</figure>
						))}
					</div>
				</div>
			</section>

			{/* PRESS STRIP */}
			<section className="relative granite-dense py-14 border-y border-white/5">
				<div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
					<div className="text-center text-[10px] tracking-[0.32em] uppercase text-foreground/50 mb-8">
						As covered in
					</div>
					<div className="flex flex-wrap items-center justify-center gap-x-10 sm:gap-x-16 gap-y-6">
						{PRESS.map((name) => (
							<span
								key={name}
								className="font-display italic text-bone/70 text-xl sm:text-2xl hover:text-bone transition-colors"
							>
								{name}
							</span>
						))}
					</div>
				</div>
			</section>
		</>
	);
}

function Stat({ value, label }: { value: string; label: string }) {
	return (
		<div>
			<div className="font-display text-3xl sm:text-4xl font-light text-bone leading-none">{value}</div>
			<div className="mt-2 text-[10px] tracking-[0.22em] uppercase text-foreground/55">{label}</div>
		</div>
	);
}
