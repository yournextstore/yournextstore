import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

const PILLARS = [
	{
		num: "01",
		title: "Slow goods",
		body: "We make in small batches with material we can trace from soil to shelf.",
	},
	{
		num: "02",
		title: "Refill rituals",
		body: "Every product has a refill. Every package finds its way back into the loop.",
	},
	{
		num: "03",
		title: "Honest people",
		body: "We pay living wages, share margins, and tell the truth about what we don't yet know.",
	},
];

export function About() {
	return (
		<section id="mission" className="relative bg-cream-gradient py-24 sm:py-36 overflow-hidden">
			{/* Background watermark text */}
			<div
				aria-hidden="true"
				className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none select-none font-display text-[clamp(8rem,22vw,22rem)] leading-none text-[var(--olive)] opacity-[0.07] tracking-tighter text-center whitespace-nowrap"
			>
				Our Mission
			</div>

			<div className="relative max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
				<div className="grid lg:grid-cols-12 gap-12 items-start">
					{/* Image column */}
					<div className="lg:col-span-5 relative">
						<div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-30px_rgb(56_70_38/0.4)]">
							<Image
								src="/scraped-4.jpg"
								alt="Calm interior with natural light"
								fill
								sizes="(max-width: 1024px) 100vw, 40vw"
								className="object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-[var(--olive-deep)]/30 to-transparent" />

							<div className="absolute top-6 left-6 right-6 flex items-center justify-between">
								<span className="bg-[var(--cream)]/90 backdrop-blur-md rounded-full px-3 py-1 text-[10px] tracking-[0.22em] uppercase text-[var(--olive-deep)]">
									Est. 2026
								</span>
								<span className="bg-[var(--cream)]/90 backdrop-blur-md rounded-full px-3 py-1 text-[10px] tracking-[0.22em] uppercase text-[var(--olive-deep)]">
									B-Corp
								</span>
							</div>
						</div>
						{/* Stat card */}
						<div className="absolute -bottom-8 -right-4 sm:-right-8 bg-[var(--olive-deep)] text-[var(--cream)] rounded-2xl p-6 max-w-[220px] shadow-xl">
							<p className="font-display text-5xl tracking-tight">
								1<span className="text-[var(--clay)]">%</span>
							</p>
							<p className="mt-2 text-xs leading-relaxed text-[var(--cream)]/75">
								of every order plants a tree through 1% for the Planet
							</p>
						</div>
					</div>

					{/* Copy column */}
					<div className="lg:col-span-7 lg:pl-8">
						<span className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-[var(--olive)] mb-6">
							<span className="h-px w-8 bg-[var(--olive)]" />
							Our Mission
						</span>
						<h2 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[1] tracking-tight text-[var(--olive-deep)]">
							A quieter <em className="italic font-light">kind</em>
							<br />
							of beautiful.
						</h2>
						<p className="mt-8 text-lg text-[var(--stone)] leading-relaxed max-w-xl">
							Your Next Store is a small atelier on a slow mission: to make daily essentials worth keeping —
							and to leave the world a little softer than we found it. We choose materials that age with
							grace, formulas that respect skin and soil, and shipping that doesn't cost the earth.
						</p>

						<div className="mt-12 grid sm:grid-cols-3 gap-8">
							{PILLARS.map((p) => (
								<div key={p.num} className="border-t border-[var(--olive-deep)]/15 pt-5">
									<p className="font-display text-3xl text-[var(--olive)] mb-2">{p.num}</p>
									<h3 className="text-base font-medium text-[var(--olive-deep)] mb-2">{p.title}</h3>
									<p className="text-sm text-[var(--stone)] leading-relaxed">{p.body}</p>
								</div>
							))}
						</div>

						<div className="mt-12">
							<YnsLink
								href="/products"
								className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--olive-deep)]"
							>
								<span className="border-b border-[var(--olive-deep)]/40 pb-0.5">Read our impact report</span>
								<ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
