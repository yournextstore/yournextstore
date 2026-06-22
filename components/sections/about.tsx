import Image from "next/image";
import { YnsLink } from "../yns-link";

const pillars = [
	{
		tint: "bg-brand-coral text-white",
		title: "Real Ingredients",
		body: "Whole fruit, raw nuts, and superfoods you can pronounce. No fillers — ever.",
	},
	{
		tint: "bg-brand-green text-white",
		title: "Functional Bites",
		body: "Adaptogens, probiotics, and protein quietly working under the surface.",
	},
	{
		tint: "bg-brand-mustard text-brand-ink",
		title: "Dessert Energy",
		body: "Made to taste like a treat your six-year-old self would beg you for.",
	},
];

export function About() {
	return (
		<section id="about" className="bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
					<div className="relative aspect-[4/5] sm:aspect-[5/6] rounded-[32px] overflow-hidden bg-brand-cream">
						<Image
							src="/scraped-1.jpg"
							alt="A spread of snack pouches on a sunny tabletop"
							fill
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="object-cover"
						/>
						<div
							aria-hidden
							className="absolute inset-0 bg-gradient-to-t from-brand-ink/30 via-transparent to-transparent"
						/>
						<div className="absolute bottom-5 left-5 rounded-2xl bg-white/95 backdrop-blur px-4 py-3 shadow-md">
							<p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-coral">
								The mission
							</p>
							<p className="mt-1 text-sm font-medium text-brand-ink leading-snug max-w-[18ch]">
								Snacks that fuel you back to yourself.
							</p>
						</div>
					</div>

					<div>
						<span className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-coral">
							Our story
						</span>
						<h2 className="mt-3 font-display text-4xl sm:text-5xl tracking-tight text-brand-ink">
							A revolutionary superfood snack, packed with nostalgia.
						</h2>
						<p className="mt-5 text-lg text-brand-ink/70 leading-relaxed">
							Your Next Store was born from a simple idea: that the snacks we love most as kids — the sticky,
							the chocolatey, the wildly fun — could grow up with us, and actually be good for us too.
						</p>
						<div className="mt-8 grid gap-3 sm:grid-cols-3">
							{pillars.map((p) => (
								<div key={p.title} className={`rounded-2xl p-4 ${p.tint}`}>
									<p className="font-display text-xl leading-tight">{p.title}</p>
									<p className="mt-1.5 text-[13px] leading-snug opacity-90">{p.body}</p>
								</div>
							))}
						</div>
						<div className="mt-9">
							<YnsLink prefetch={"eager"} href="/products" className="btn-pill bg-brand-ink text-white">
								Try Your Next Store
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
