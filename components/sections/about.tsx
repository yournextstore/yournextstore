import Image from "next/image";
import { YnsLink } from "../yns-link";

export function About() {
	return (
		<>
			{/* Press band */}
			<section className="bg-foreground text-background">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
						<p className="font-display text-sm font-extrabold tracking-[0.3em] uppercase shrink-0">
							As Featured In
						</p>
						<div className="flex flex-wrap items-center gap-6 sm:gap-10 text-background/80">
							{["BUZZWORTHY", "PARENTS WEEKLY", "FUEL & FIELD", "GOOD FOR KIDS", "SNACK MAG"].map((name) => (
								<span key={name} className="font-display text-base sm:text-lg font-extrabold tracking-wider">
									{name}
								</span>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Ingredient story */}
			<section id="story" className="relative bg-[--color-butter] overflow-hidden">
				<div className="absolute inset-x-0 top-0 h-1 bg-foreground" />
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
					<div className="relative">
						<div className="absolute -inset-2 bg-foreground rounded-[28px] rotate-[-2deg]" />
						<div className="relative rounded-3xl overflow-hidden aspect-[4/3] border-2 border-foreground bg-white">
							<Image
								src="/scraped-3.jpg"
								alt="Honey drizzle over fresh fruit"
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover"
							/>
						</div>
						{/* Honey drop badge */}
						<div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 z-10 wiggle">
							<div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-[--color-honey-pop] border-2 border-foreground flex flex-col items-center justify-center text-center">
								<span className="font-display text-3xl sm:text-4xl font-extrabold leading-none">100%</span>
								<span className="text-[10px] font-bold tracking-[0.2em] mt-1">REAL HONEY</span>
							</div>
						</div>
					</div>

					<div>
						<span className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-3 py-1 text-[10px] font-bold tracking-[0.25em]">
							INGREDIENT STORY
						</span>
						<h2 className="mt-4 font-display font-extrabold text-foreground text-4xl sm:text-5xl lg:text-6xl tracking-tight uppercase leading-[0.95]">
							Honey is the
							<br />
							<span className="text-[--color-melon-pop]">original</span> fuel.
						</h2>
						<p className="mt-6 text-foreground/80 text-base sm:text-lg leading-relaxed max-w-lg">
							We swapped corn syrup for raw honey, ditched the dyes, and added an electrolyte blend that
							actually helps kids bounce back. Every pouch packs real fruit, no junk, and a taste that wins
							the post‑game vote.
						</p>

						<dl className="mt-10 grid grid-cols-3 gap-3 max-w-md">
							{[
								{ k: "7g", v: "added sugar" },
								{ k: "0", v: "artificial dyes" },
								{ k: "60m", v: "of fuel" },
							].map((stat) => (
								<div key={stat.v} className="rounded-2xl bg-white border-2 border-foreground p-4 text-center">
									<dt className="font-display text-2xl sm:text-3xl font-extrabold leading-none">{stat.k}</dt>
									<dd className="mt-1 text-[10px] font-bold tracking-[0.2em] uppercase text-foreground/70">
										{stat.v}
									</dd>
								</div>
							))}
						</dl>

						<div className="mt-10">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-foreground text-background font-display font-extrabold uppercase tracking-wide text-sm hover:bg-[--color-melon-pop] transition-colors"
							>
								Shop the snacks
							</YnsLink>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
