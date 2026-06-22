export function PressSection() {
	const pressItems = [
		{
			quote: "Also the customer service is phenomenal. I would purchase again.",
			source: "VOGUE",
		},
		{
			quote: "Great product line. Very attentive staff to deal with.",
			source: "ELLE",
		},
		{
			quote: "Looking to affordably upgrade your everyday skincare? Look no further than Your Next Store",
			source: "ALLURE",
		},
	];

	return (
		<section className="py-16 sm:py-24 border-y border-border">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h2 className="font-heading text-2xl sm:text-3xl font-light text-center mb-12">Featured by Press</h2>
				<div className="grid sm:grid-cols-3 gap-8 sm:gap-12">
					{pressItems.map((item) => (
						<div key={item.source} className="text-center space-y-4">
							<p className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-semibold">
								{item.source}
							</p>
							<p className="text-base leading-relaxed text-foreground italic">&ldquo;{item.quote}&rdquo;</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
