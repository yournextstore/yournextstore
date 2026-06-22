import Image from "next/image";

const reviews = [
	{
		quote:
			"Finally — a protein snack that doesn’t taste like a vitamin chewed up a pretzel. I keep a bag in my desk and one in the gym.",
		author: "Maya R.",
		role: "Verified buyer · Lemon Shortbread",
		rating: 5,
	},
	{
		quote:
			"My kids actually ask for these. I read the ingredients three times to make sure it wasn’t a typo. Twenty grams of protein in something they like.",
		author: "Jonas T.",
		role: "Verified buyer · Chocolate Chip",
		rating: 5,
	},
	{
		quote:
			"I’ve tried every protein cookie on the internet. This is the first one I’d eat even if it had no protein in it.",
		author: "Priya K.",
		role: "Verified buyer · Variety Pack",
		rating: 5,
	},
];

export function Testimonial() {
	return (
		<section className="relative bg-[var(--cream)] border-y border-foreground/10 overflow-hidden">
			<Image
				src="/scraped-4.jpg"
				alt=""
				aria-hidden="true"
				fill
				sizes="100vw"
				className="object-cover opacity-15"
			/>
			<div className="absolute inset-0 bg-gradient-to-b from-[var(--cream)]/60 via-[var(--cream)]/85 to-[var(--cream)]" />
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="text-center mb-12 sm:mb-16">
					<span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-[var(--crimson)] mb-4">
						<span aria-hidden="true" className="h-px w-6 bg-[var(--crimson)]" />
						Loved by snack people
					</span>
					<h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground max-w-3xl mx-auto leading-tight">
						&ldquo;Tastes like a treat. Eats like a meal.&rdquo;
					</h2>
					<div className="mt-5 flex items-center justify-center gap-2 text-sm text-muted-foreground">
						<span className="flex gap-0.5" aria-hidden="true">
							{Array.from({ length: 5 }).map((_, i) => (
								<svg
									// biome-ignore lint/suspicious/noArrayIndexKey: rating stars are static
									key={`star-head-${i}`}
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="#1B3FA0"
								>
									<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
								</svg>
							))}
						</span>
						<span>4.9 · 1,200+ verified reviews</span>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{reviews.map((r, i) => (
						<figure
							key={r.author}
							className="bg-white border border-foreground/10 p-7 sm:p-8 flex flex-col gap-5 hover:shadow-[0_12px_40px_rgba(10,10,10,0.06)] transition-shadow"
						>
							<div className="flex items-center justify-between">
								<div className="flex gap-0.5" aria-hidden="true">
									{Array.from({ length: r.rating }).map((_, j) => (
										<svg
											// biome-ignore lint/suspicious/noArrayIndexKey: rating stars are static
											key={`star-${i}-${j}`}
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="#C63A2A"
										>
											<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
										</svg>
									))}
								</div>
								<span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
									Vol. 0{i + 1}
								</span>
							</div>
							<blockquote className="text-base sm:text-[17px] text-foreground leading-relaxed flex-1">
								“{r.quote}”
							</blockquote>
							<figcaption className="pt-4 border-t border-foreground/10">
								<div className="text-sm font-medium text-foreground">{r.author}</div>
								<div className="text-xs text-muted-foreground mt-0.5">{r.role}</div>
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}
