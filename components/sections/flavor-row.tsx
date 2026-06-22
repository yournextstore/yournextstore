import { ArrowRight } from "lucide-react";
import { YnsLink } from "../yns-link";

const flavors = [
	{
		name: "Delightful Mint",
		tag: "Daily fresh",
		bg: "bg-[var(--color-mint)]/90",
		swatch: "bg-[var(--color-mint)]",
		ink: "text-emerald-950",
		blurb: "Cool, crisp and unmistakably mint — without the medicinal aftertaste.",
		href: "/products",
	},
	{
		name: "Piña Colada",
		tag: "Tropical brunch",
		bg: "bg-[var(--color-sunshine)]/90",
		swatch: "bg-[var(--color-sunshine)]",
		ink: "text-amber-950",
		blurb: "Roasted pineapple, coconut cream and a tiny squeeze of lime.",
		href: "/products",
	},
	{
		name: "Lychee Breeze",
		tag: "Fresh floral",
		bg: "bg-[var(--color-coral)]/90",
		swatch: "bg-[var(--color-coral)]",
		ink: "text-rose-950",
		blurb: "Pink lychee, white grapefruit and a whisper of jasmine.",
		href: "/products",
	},
] as const;

export function FlavorRow() {
	return (
		<section className="bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
					<div>
						<p className="text-xs font-extrabold uppercase tracking-[0.2em] text-muted-foreground mb-3">
							The flavor wall
						</p>
						<h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
							Three flavors. Zero compromise.
						</h2>
					</div>
					<p className="max-w-sm text-muted-foreground">
						Each tube is co-developed with the same flavor houses behind your favorite sparkling waters.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{flavors.map((flavor) => (
						<YnsLink
							key={flavor.name}
							href={flavor.href}
							prefetch={"eager"}
							className={`group relative overflow-hidden rounded-3xl ${flavor.bg} p-6 sm:p-7 aspect-[4/5] flex flex-col justify-between transition-transform hover:-translate-y-1`}
						>
							{/* Bubble decorations */}
							<div aria-hidden className="pointer-events-none absolute inset-0">
								<span className="absolute top-6 right-6 h-16 w-16 rounded-full bg-white/30" />
								<span className="absolute top-24 right-20 h-10 w-10 rounded-full bg-white/40" />
								<span className="absolute bottom-24 left-8 h-8 w-8 rounded-full bg-white/30" />
								<span className="absolute bottom-12 right-12 h-12 w-12 rounded-full bg-white/25" />
							</div>

							<div className="relative z-10 flex items-center justify-between">
								<span
									className={`inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${flavor.ink}`}
								>
									<span className={`h-2 w-2 rounded-full ${flavor.swatch}`} />
									{flavor.tag}
								</span>
								<ArrowRight
									className={`h-5 w-5 ${flavor.ink} transition-transform group-hover:translate-x-1`}
								/>
							</div>

							<div className="relative z-10">
								<h3
									className={`font-display text-3xl sm:text-4xl font-extrabold leading-[0.95] ${flavor.ink}`}
								>
									{flavor.name}
								</h3>
								<p className={`mt-3 text-sm ${flavor.ink} opacity-80 max-w-[18ch]`}>{flavor.blurb}</p>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
