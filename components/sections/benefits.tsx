import { Droplets, Leaf, Sparkles } from "lucide-react";

const benefits = [
	{
		icon: Droplets,
		title: "Deeply Hydrating",
		body: "Plant-derived emollients drench every strand in long-lasting moisture, leaving hair touchable and full of life.",
	},
	{
		icon: Sparkles,
		title: "Frizz-Fighting",
		body: "Lightweight silk proteins smooth flyaways without weighing your hair down — soft, glossy, gorgeously you.",
	},
	{
		icon: Leaf,
		title: "Clean & Vegan",
		body: "Cruelty-free formulas blended without sulfates, parabens, or anything you can't pronounce. Just good ingredients.",
	},
];

export function Benefits() {
	return (
		<section className="bg-[color:var(--yns-cream)]">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-24">
				<div className="text-center max-w-2xl mx-auto mb-14">
					<span className="font-script text-3xl text-[color:var(--yns-red)]">why we work</span>
					<h2 className="mt-2 font-display text-4xl sm:text-5xl uppercase tracking-tight text-[color:var(--yns-ink)]">
						Built for unruly hair
					</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-14">
					{benefits.map((b) => (
						<div key={b.title} className="text-center">
							<div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--yns-pink)] text-white">
								<b.icon className="h-7 w-7" strokeWidth={1.75} />
							</div>
							<h3 className="font-display text-2xl uppercase tracking-tight text-[color:var(--yns-ink)]">
								{b.title}
							</h3>
							<p className="mt-3 text-[color:var(--yns-ink)]/70 leading-relaxed max-w-xs mx-auto">{b.body}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
