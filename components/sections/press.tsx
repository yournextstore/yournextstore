const quotes = [
	{ quote: "A still life you can actually live with.", source: "Kinfolk" },
	{ quote: "Slow design, finally done well.", source: "Cereal" },
	{ quote: "The kind of brand you keep on the shelf for years.", source: "T Magazine" },
	{ quote: "Restraint, deployed beautifully.", source: "Dezeen" },
	{ quote: "A standard for what small objects can do.", source: "Apartamento" },
];

export function Press() {
	return (
		<section className="bg-[#f2ebdd] py-16 sm:py-20 overflow-hidden">
			<div className="relative">
				<div className="flex realm-marquee whitespace-nowrap will-change-transform">
					{[...quotes, ...quotes].map((q, i) => (
						<div key={`${q.source}-${i}`} className="flex items-center shrink-0 px-12">
							<p className="font-serif text-2xl sm:text-3xl lg:text-4xl text-foreground tracking-[-0.01em]">
								&ldquo;<span className="italic font-light">{q.quote}</span>&rdquo;
							</p>
							<span className="ml-6 text-[10px] tracking-[0.4em] uppercase text-foreground/55">
								&mdash; {q.source}
							</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
