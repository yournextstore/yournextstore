import Image from "next/image";
import { YnsLink } from "@/components/yns-link";

const stats = [
	{ value: "200mg", label: "Natural Caffeine" },
	{ value: "0g", label: "Sugar" },
	{ value: "0cal", label: "Calories" },
	{ value: "15", label: "Pouches / Tin" },
];

export function About() {
	return (
		<section id="about" className="relative overflow-hidden bg-foreground text-background">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-y-0 right-0 w-[55%] opacity-30"
				style={{
					backgroundImage: "radial-gradient(circle, #f1f23b 1.4px, transparent 1.5px)",
					backgroundSize: "22px 22px",
					maskImage: "radial-gradient(ellipse at right, black 0%, transparent 75%)",
					WebkitMaskImage: "radial-gradient(ellipse at right, black 0%, transparent 75%)",
				}}
			/>
			<div className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-12 lg:gap-16 lg:px-10">
				<div className="lg:col-span-7">
					<p className="text-xs font-semibold uppercase tracking-[0.24em] text-zap">The Science</p>
					<h2 className="mt-4 font-display text-5xl uppercase leading-[0.9] sm:text-6xl lg:text-7xl xl:text-8xl">
						Energy
						<br />
						that actually
						<br />
						<span className="text-zap">works.</span>
					</h2>
					<p className="mt-8 max-w-xl text-base leading-relaxed text-background/70 sm:text-lg">
						We engineered Your Next Store pouches to give you sustained, jitter-free focus. Plant-derived
						caffeine, a clean stack of B-vitamins, and natural flavors — no sugar, no nicotine, no nonsense.
						Just upgraded hours.
					</p>
					<div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
						{stats.map((s) => (
							<div key={s.label}>
								<p className="font-display text-4xl uppercase leading-none text-zap sm:text-5xl">{s.value}</p>
								<p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-background/60">
									{s.label}
								</p>
							</div>
						))}
					</div>
					<div className="mt-12 flex flex-wrap gap-3">
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="inline-flex items-center justify-center rounded-full bg-zap px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-foreground transition-all hover:-translate-y-0.5"
						>
							Shop Pouches
						</YnsLink>
						<YnsLink
							prefetch={"eager"}
							href="/faq"
							className="inline-flex items-center justify-center rounded-full border border-background/30 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-background transition-all hover:border-zap hover:text-zap"
						>
							Read The Science
						</YnsLink>
					</div>
				</div>
				<div className="relative lg:col-span-5">
					<div className="relative aspect-[4/5] overflow-hidden bg-zap">
						<Image
							src="/scraped-1.jpg"
							alt="YNS energy ingredients"
							fill
							sizes="(max-width: 1024px) 100vw, 40vw"
							className="object-cover"
						/>
						<div
							aria-hidden="true"
							className="absolute inset-0 mix-blend-multiply opacity-50"
							style={{
								backgroundImage: "radial-gradient(circle, #0a0a0a 1.4px, transparent 1.6px)",
								backgroundSize: "16px 16px",
							}}
						/>
						<div className="absolute bottom-6 left-6 right-6">
							<p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground">
								Lab-tested · 3rd-party verified
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
