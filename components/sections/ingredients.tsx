import { Leaf, Moon, Sparkles } from "lucide-react";

const items = [
	{
		icon: Moon,
		title: "Magnesium glycinate",
		copy: "Calms the nervous system and eases tension so the body can settle.",
	},
	{
		icon: Leaf,
		title: "Adaptogenic botanicals",
		copy: "Ashwagandha, passionflower, and chamomile to quiet a racing mind.",
	},
	{
		icon: Sparkles,
		title: "Amino acids",
		copy: "L-theanine and glycine support deep, uninterrupted restorative sleep.",
	},
];

export function Ingredients() {
	return (
		<section className="bg-cream/60 border-y border-border/60">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="grid gap-10 md:grid-cols-3">
					{items.map((item) => (
						<div key={item.title} className="text-center px-4">
							<div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-primary/25 bg-background/60">
								<item.icon className="h-6 w-6 text-primary" strokeWidth={1.4} />
							</div>
							<h3 className="font-serif text-xl text-foreground mb-2">{item.title}</h3>
							<p className="text-sm leading-relaxed text-muted-foreground max-w-xs mx-auto">{item.copy}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
