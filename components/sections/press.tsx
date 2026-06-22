const PRESS = ["Bon Appétit", "Cherry Bombe", "PUNCH", "Imbibe", "Goop", "Forbes"];

const QUOTES = [
	{
		text: "Finally — a canned cocktail that tastes like it was actually shaken, not algorithmed.",
		source: "Bon Appétit",
	},
	{
		text: "Low-sugar, real-spirits, and somehow more fun than a fully-stocked bar.",
		source: "PUNCH",
	},
	{
		text: "The party in a can our group chat has been waiting for.",
		source: "Cherry Bombe",
	},
];

export function Press() {
	return (
		<section className="bg-[color:var(--cream-deep)] border-y border-[color:var(--border)]">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-20">
				<p className="text-center text-[11px] uppercase tracking-[0.24em] font-semibold text-[color:var(--brown-warm)]">
					As seen in
				</p>
				<div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-14 gap-y-4">
					{PRESS.map((name) => (
						<span
							key={name}
							className="font-display text-base sm:text-xl tracking-[0.04em] text-[color:var(--charcoal)]/80"
						>
							{name}
						</span>
					))}
				</div>

				<div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
					{QUOTES.map((q) => (
						<figure key={q.source} className="relative">
							<span
								aria-hidden
								className="absolute -top-4 -left-2 font-display text-6xl leading-none text-[color:var(--dusty-blue)]/30 select-none"
							>
								&ldquo;
							</span>
							<blockquote className="pl-4 text-base sm:text-lg leading-relaxed text-[color:var(--charcoal)]">
								{q.text}
							</blockquote>
							<figcaption className="mt-4 pl-4 text-[11px] uppercase tracking-[0.22em] font-semibold text-[color:var(--brown-warm)]">
								— {q.source}
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}
