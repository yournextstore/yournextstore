const QUOTES = [
	{
		quote:
			"My morning toast got a personality transplant. The Cheese Tease blend lives next to the salt now.",
		author: "Maya R.",
		role: "Brooklyn, NY",
		tint: "#a8e0dc",
	},
	{
		quote:
			"I sprinkled this on roasted carrots and my partner asked what restaurant they came from. Sorry babe, it's a pouch.",
		author: "Ezra V.",
		role: "Portland, OR",
		tint: "#f5a623",
	},
	{
		quote:
			"Plant-based, no weird fillers, and the packaging is genuinely gorgeous. My pantry has main character energy.",
		author: "Priya S.",
		role: "Austin, TX",
		tint: "#9f9cf5",
	},
];

export function Testimonials() {
	return (
		<section className="relative overflow-hidden bg-[#9f9cf5] py-16 sm:py-24">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 opacity-[0.15] bg-[radial-gradient(circle_at_20%_20%,#fbe9d7_1.5px,transparent_1.5px),radial-gradient(circle_at_80%_60%,#fbe9d7_1.5px,transparent_1.5px)] bg-[size:60px_60px,90px_90px]"
			/>
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center max-w-xl mx-auto">
					<span className="inline-flex items-center gap-2 rounded-full bg-[#1b2a2e] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#fbe9d7]">
						<span className="h-1.5 w-1.5 rounded-full bg-[#f5a623]" />
						Say Hello
					</span>
					<h2 className="mt-4 font-display text-3xl sm:text-5xl font-black tracking-tight text-[#1b2a2e]">
						Loved by sprinkle enthusiasts.
					</h2>
				</div>

				<div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
					{QUOTES.map((q) => (
						<figure
							key={q.author}
							className="relative rounded-3xl bg-[#fbe9d7] p-7 sm:p-8 border border-[#1b2a2e]/10 shadow-[0_25px_60px_-25px_rgba(27,42,46,0.4)]"
						>
							<div
								aria-hidden="true"
								className="absolute -top-5 left-7 flex h-12 w-12 items-center justify-center rounded-full text-3xl font-black text-[#1b2a2e] font-display"
								style={{ backgroundColor: q.tint }}
							>
								&ldquo;
							</div>
							<blockquote className="mt-4 font-display text-lg leading-snug text-[#1b2a2e]">
								{q.quote}
							</blockquote>
							<figcaption className="mt-6 flex items-center gap-3">
								<div
									className="flex h-10 w-10 items-center justify-center rounded-full font-display text-sm font-black text-[#1b2a2e]"
									style={{ backgroundColor: q.tint }}
								>
									{q.author.charAt(0)}
								</div>
								<div>
									<p className="font-display text-sm font-bold text-[#1b2a2e]">{q.author}</p>
									<p className="text-xs text-[#1b2a2e]/60">{q.role}</p>
								</div>
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}
