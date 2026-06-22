import Image from "next/image";
import { YnsLink } from "../yns-link";

const pillars = [
	{
		k: "01",
		title: "Clinically informed",
		body: "Every formulation is grounded in peer-reviewed research and third-party tested before it ever reaches your shelf.",
	},
	{
		k: "02",
		title: "Whole food first",
		body: "We start with the plate. Supplements should fill the gaps in a diet of real, identifiable ingredients — never replace it.",
	},
	{
		k: "03",
		title: "30-day promise",
		body: "Try it for a full cycle. If you don't feel the difference in how you recover, focus, and sleep, we'll refund every cent.",
	},
];

export function About() {
	return (
		<section id="science" className="relative overflow-hidden bg-[color:var(--secondary)]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
				<div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
					{/* Editorial photo */}
					<div className="lg:col-span-5">
						<div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm ring-1 ring-border/60">
							<Image
								src="/scraped-2.jpg"
								alt="Whole foods arrangement"
								fill
								sizes="(max-width: 1024px) 100vw, 40vw"
								className="object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
							<div className="absolute bottom-5 left-5 right-5 text-cream">
								<p className="text-[10px] tracking-[0.28em] uppercase font-semibold">
									Fig. 01 — Whole food synergy
								</p>
							</div>
						</div>
					</div>

					{/* Copy */}
					<div className="lg:col-span-7 lg:pl-8">
						<p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-terracotta">
							The Science
						</p>
						<h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl text-ink leading-[1.05] tracking-tight text-balance">
							A protocol designed for the way your body actually digests protein.
						</h2>
						<p className="mt-6 text-base sm:text-lg text-clay leading-relaxed max-w-xl">
							Your Next Store builds enzyme-forward supplements that respect the kitchen first. Every capsule
							is engineered to make the food you already eat — steak, salmon, eggs, lentils — work harder for
							your muscles, mind, and metabolism.
						</p>

						<div className="mt-12 grid sm:grid-cols-3 gap-8">
							{pillars.map((p) => (
								<div key={p.k} className="border-t border-ink/15 pt-5">
									<span className="font-display text-3xl text-terracotta">{p.k}</span>
									<h3 className="mt-3 text-base font-semibold tracking-wide text-ink">{p.title}</h3>
									<p className="mt-2 text-sm text-clay leading-relaxed">{p.body}</p>
								</div>
							))}
						</div>

						<div className="mt-12">
							<YnsLink
								prefetch={"eager"}
								href="/faq"
								className="group inline-flex items-center gap-3 text-[11px] font-semibold tracking-[0.22em] uppercase text-ink hover:text-terracotta transition-colors"
							>
								Read the discovery
								<span className="inline-block h-px w-10 bg-current transition-all group-hover:w-16" />
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
