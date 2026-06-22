const quotes = [
	{
		text: "A bottle that belongs in a museum and on every dinner table.",
		source: "Bon Appétit",
	},
	{
		text: "Painterly heat. The most photogenic hot sauce of the year.",
		source: "Eater",
	},
	{
		text: "Italian fire, finally in a bottle worth keeping.",
		source: "Saveur",
	},
	{
		text: "Old-world technique meets new-world bravado.",
		source: "Food & Wine",
	},
];

export function Press() {
	return (
		<section className="paper-texture relative border-y border-[color:#0f2a3f]/10 py-16 lg:py-20">
			<div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10">
				<p className="divider-ornament mx-auto block w-fit">As seen in</p>

				<div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
					{quotes.map((q) => (
						<figure key={q.source} className="text-center md:text-left">
							<blockquote className="font-display text-lg italic leading-relaxed text-[color:#0f2a3f] lg:text-xl">
								&ldquo;{q.text}&rdquo;
							</blockquote>
							<figcaption className="mt-4 text-xs uppercase tracking-[0.3em] text-[color:#7c1f12]">
								— {q.source}
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}
