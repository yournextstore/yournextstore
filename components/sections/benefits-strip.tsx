import { Ban, Citrus, Droplets, Leaf, ShieldCheck, Sparkles, Wheat } from "lucide-react";

const benefits = [
	{ icon: ShieldCheck, label: "Made in nut‑free facility" },
	{ icon: Ban, label: "No allergens" },
	{ icon: Droplets, label: "Electrolyte blend" },
	{ icon: Leaf, label: "Non‑GMO" },
	{ icon: Wheat, label: "Gluten‑free" },
	{ icon: Citrus, label: "No corn syrup" },
	{ icon: Sparkles, label: "Dye free" },
];

export function BenefitsStrip() {
	return (
		<section className="border-y-2 border-foreground bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
				<ul className="flex items-center justify-between gap-4 overflow-x-auto sm:overflow-visible">
					{benefits.map((b) => (
						<li key={b.label} className="flex items-center gap-3 shrink-0 sm:shrink">
							<span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-foreground bg-[--color-secondary]">
								<b.icon className="h-4 w-4" />
							</span>
							<span className="text-[11px] sm:text-xs font-bold tracking-[0.15em] uppercase whitespace-nowrap">
								{b.label}
							</span>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
