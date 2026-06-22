import { Star } from "lucide-react";

const testimonials = [
	{
		quote:
			"I tap it on the way into the gym and my phone goes silent for ninety minutes. The most boring habit I've ever loved.",
		name: "Maya",
		role: "Brooklyn, NY",
	},
	{
		quote:
			"My evenings came back. The tag is a quiet little object on the nightstand — and somehow it changed everything.",
		name: "Theo",
		role: "Copenhagen",
	},
	{
		quote:
			"It is the only piece of tech in my house that has made my life slower in a way I actually wanted.",
		name: "Imani",
		role: "Lisbon",
	},
];

export function Testimonials() {
	return (
		<section className="relative bg-background py-20 sm:py-28">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="max-w-2xl mb-14">
					<p className="text-xs uppercase tracking-[0.22em] text-ember/90 font-medium">From the wild</p>
					<h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight text-bone text-balance">
						Quiet evenings. Real reviews.
					</h2>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{testimonials.map(({ quote, name, role }) => (
						<figure key={name} className="rounded-2xl border border-border bg-card/40 p-7 flex flex-col">
							<div className="flex gap-0.5" role="img" aria-label="5 star review">
								{Array.from({ length: 5 }).map((_, i) => (
									<Star key={`s-${name}-${i}`} className="h-4 w-4 fill-ember text-ember" strokeWidth={0} />
								))}
							</div>
							<blockquote className="mt-5 text-[15px] leading-relaxed text-bone/90 flex-1">
								&ldquo;{quote}&rdquo;
							</blockquote>
							<figcaption className="mt-6 text-sm text-muted-foreground">
								<span className="text-bone font-medium">{name}</span> · {role}
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}
