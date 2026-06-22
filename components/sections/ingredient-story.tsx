import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

const callouts = [
	{
		title: "Nano-hydroxyapatite",
		body: "Rebuilds enamel naturally. Clinically proven, fluoride-free, and dentist-loved.",
	},
	{
		title: "Real-fruit flavor",
		body: "From the same houses behind your favorite cult sparkling waters and aperitifs.",
	},
	{
		title: "Recyclable tubes",
		body: "Aluminum-free, mono-material packaging — fully curbside recyclable.",
	},
] as const;

export function IngredientStory() {
	return (
		<section className="bg-[var(--color-yellow)]/40">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16">
					<div className="relative aspect-square w-full rounded-[2rem] overflow-hidden bg-[var(--color-sunshine)]/20">
						<Image
							src="/scraped-3.jpg"
							alt="Pearly toothpaste swirl with mint leaves and droplets"
							fill
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="object-cover"
						/>
						<div className="absolute inset-x-6 bottom-6 rounded-2xl bg-white/90 px-5 py-4 backdrop-blur shadow-lg">
							<p className="text-xs font-extrabold uppercase tracking-[0.2em] text-muted-foreground">
								Inside every tube
							</p>
							<p className="mt-1 font-display text-lg font-bold text-foreground">
								12 active ingredients. 0 of the weird stuff.
							</p>
						</div>
					</div>

					<div>
						<p className="text-xs font-extrabold uppercase tracking-[0.2em] text-muted-foreground mb-3">
							The recipe
						</p>
						<h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
							Sophisticated ingredients,
							<br />
							put-it-on-the-counter design.
						</h2>
						<p className="mt-5 text-muted-foreground leading-relaxed max-w-lg">
							We pair clinically-backed actives like nano-hydroxyapatite with sourced-from-real-fruit flavor —
							so brushing finally feels like a treat, not a chore.
						</p>
						<ul className="mt-8 space-y-4">
							{callouts.map((item) => (
								<li key={item.title} className="flex items-start gap-3">
									<CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-mint)]" />
									<div>
										<p className="font-display text-base font-bold text-foreground">{item.title}</p>
										<p className="text-sm text-muted-foreground">{item.body}</p>
									</div>
								</li>
							))}
						</ul>
						<YnsLink
							href="/faq"
							prefetch={"eager"}
							className="mt-10 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-background hover:bg-foreground/90 transition"
						>
							Read the full ingredient deck
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
