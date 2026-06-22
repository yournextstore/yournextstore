import Image from "next/image";
import { YnsLink } from "../yns-link";

const pillars = [
	{
		label: "01 / Mitochondrial",
		title: "Energy at the cellular floor.",
		body: "We start where life starts — the mitochondria. Every active in the system is selected for measurable downstream effect on ATP production.",
	},
	{
		label: "02 / NAD+ metabolism",
		title: "Restore the coenzyme that ages.",
		body: "Precursors and protectors that move NAD+ in the right direction, supported by a decade of peer-reviewed longevity research.",
	},
	{
		label: "03 / Long-term resilience",
		title: "Built for the next 40 years.",
		body: "Quiet, daily inputs over loud, occasional pushes. The 90-day protocol is the smallest unit at which the body adapts.",
	},
];

export function About() {
	return (
		<section id="about" className="bg-background border-t border-border">
			<div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
				<div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-start">
					<div className="lg:sticky lg:top-24">
						<p className="text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">The Science</p>
						<h2 className="mt-5 font-display text-[2.1rem] sm:text-[2.8rem] leading-[1.05] tracking-[-0.03em] text-balance">
							A complete system, not another supplement.
						</h2>
						<p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
							Most supplement stacks fight each other. We engineered ours to compound — thirteen actives,
							three pathways, one rhythm. The result is something the body recognizes.
						</p>
						<div className="mt-8 inline-flex items-center gap-3">
							<YnsLink
								prefetch={"eager"}
								href="/faq"
								className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-foreground px-6 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-primary-foreground"
							>
								Read the research
							</YnsLink>
							<span className="text-xs text-muted-foreground">12 published trials</span>
						</div>
					</div>

					<ul className="space-y-12 lg:space-y-14">
						{pillars.map((pillar) => (
							<li
								key={pillar.label}
								className="grid grid-cols-[auto_1fr] gap-6 border-t border-border pt-8 first:border-t-0 first:pt-0"
							>
								<div className="h-12 w-12 rounded-full bg-bone-deep flex items-center justify-center">
									<span className="font-display text-[0.85rem] text-moss">
										{pillar.label.split(" / ")[0]}
									</span>
								</div>
								<div>
									<p className="text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
										{pillar.label.split(" / ")[1]}
									</p>
									<h3 className="mt-2 font-display text-[1.4rem] leading-tight tracking-[-0.02em]">
										{pillar.title}
									</h3>
									<p className="mt-3 text-[0.92rem] leading-relaxed text-muted-foreground">{pillar.body}</p>
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
}

export function ResearchCallout() {
	return (
		<section className="relative bg-forest-gradient text-bone overflow-hidden">
			<div className="absolute inset-0 opacity-30">
				<Image src="/scraped-3.jpg" alt="" fill sizes="100vw" className="object-cover mix-blend-overlay" />
			</div>
			<div className="relative max-w-5xl mx-auto px-5 sm:px-8 py-24 sm:py-32 text-center">
				<p className="text-[0.7rem] uppercase tracking-[0.22em] text-bone/60">Research &amp; Insights</p>
				<blockquote className="mt-8 font-display text-[1.6rem] sm:text-[2.1rem] lg:text-[2.5rem] leading-[1.15] tracking-[-0.025em] text-balance">
					&ldquo;Sustained mitochondrial support is the most underrated lever in modern longevity care — it
					changes how a body recovers, sleeps, and ages.&rdquo;
				</blockquote>
				<div className="mt-10 flex items-center justify-center gap-4 text-sm text-bone/70">
					<span className="h-px w-12 bg-bone/30" aria-hidden="true" />
					<span>Dr. Eleanor Vance — Integrative Medicine, MIT Aging Lab</span>
					<span className="h-px w-12 bg-bone/30" aria-hidden="true" />
				</div>
			</div>
		</section>
	);
}

export function PractitionerStrip() {
	const items = [
		{ value: "13", label: "Active compounds" },
		{ value: "90", label: "Day protocol" },
		{ value: "2,400+", label: "Practitioner referrals" },
		{ value: "94%", label: "Felt the shift" },
	];
	return (
		<section className="bg-bone-deep border-y border-border">
			<div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6">
				{items.map((item) => (
					<div key={item.label} className="text-center lg:text-left">
						<p className="font-display text-[2.6rem] sm:text-[3.2rem] leading-none tracking-[-0.04em] text-foreground">
							{item.value}
						</p>
						<p className="mt-3 text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
							{item.label}
						</p>
					</div>
				))}
			</div>
		</section>
	);
}
