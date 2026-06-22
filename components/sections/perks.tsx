import { Gem, Leaf, Sparkles, Truck } from "lucide-react";

const perks = [
	{
		icon: Sparkles,
		title: "Hand-poured",
		desc: "Bottled by hand in our Grasse atelier.",
	},
	{
		icon: Gem,
		title: "Cruelty-free",
		desc: "Never tested on animals. Ever.",
	},
	{
		icon: Leaf,
		title: "Clean ingredients",
		desc: "Vegan-friendly, IFRA compliant.",
	},
	{
		icon: Truck,
		title: "Wrapped & shipped",
		desc: "Complimentary white-glove delivery.",
	},
];

export function Perks() {
	return (
		<section className="border-y border-border/60 bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
				<div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
					{perks.map((perk) => (
						<div key={perk.title} className="flex items-start gap-3">
							<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--color-luxe-cream)] text-[color:var(--color-luxe-violet)]">
								<perk.icon className="h-5 w-5" />
							</div>
							<div>
								<p className="text-sm font-semibold text-foreground">{perk.title}</p>
								<p className="text-xs text-muted-foreground">{perk.desc}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
