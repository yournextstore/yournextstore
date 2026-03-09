const testimonials = [
	{
		stars: 5,
		text: "Simply genius, my desk has never looked better. Beautiful craftsmanship too.",
		source: "Gizmodo",
	},
	{
		stars: 5,
		text: "I never realized what a distraction my cluttered desk was until I organized it.",
		source: "Techcrunch",
	},
	{
		stars: 4,
		text: "I can focus so much more easily now that I don't have the desk of a small child.",
		source: "New York Times",
	},
	{
		stars: 3,
		text: "A fantastic product. I'm surprised how much of a difference it has made.",
		source: "The Verge",
	},
];

function Stars({ count }: { count: number }) {
	return (
		<div className="flex gap-0.5 justify-center mb-4">
			{Array.from({ length: 5 }).map((_, i) => (
				<svg
					key={`star-${i}`}
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill={i < count ? "currentColor" : "none"}
					stroke="currentColor"
					strokeWidth="1.5"
					className="text-foreground"
				>
					<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
				</svg>
			))}
		</div>
	);
}

export function Testimonials() {
	return (
		<section className="border-t border-b border-border">
			<div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-14">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
					{testimonials.map((t) => (
						<div key={t.source} className="text-center">
							<Stars count={t.stars} />
							<blockquote className="text-sm text-foreground leading-relaxed italic mb-3">
								&ldquo;{t.text}&rdquo;
							</blockquote>
							<cite className="text-xs uppercase tracking-[0.15em] text-muted-foreground not-italic">
								{t.source}
							</cite>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
