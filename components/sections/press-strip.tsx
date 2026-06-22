const press = [
	{ name: "Bon Appétit", quote: "The spice tin worth keeping out on the counter." },
	{ name: "Saveur", quote: "Some of the brightest za'atar we've tasted, full stop." },
	{ name: "Vogue", quote: "Heritage flavor with a modern, gifting-ready wardrobe." },
	{ name: "Food & Wine", quote: "An Arab pantry, reverently re-introduced." },
];

export function PressStrip() {
	return (
		<section id="impact" className="bg-[#7a0e15] text-[#fbe5ea] py-16 sm:py-20 relative">
			<div className="hayati-star-row absolute inset-x-0 top-0 h-4 opacity-90" aria-hidden />
			<div className="hayati-star-row absolute inset-x-0 bottom-0 h-4 opacity-90" aria-hidden />
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-12">
					<p className="text-[11px] uppercase tracking-[0.3em] text-[#d9a441] font-semibold">
						As featured in
					</p>
					<h2 className="mt-3 font-display italic text-3xl sm:text-4xl text-[#fbe5ea]">
						Pressed, gifted, and table-tested.
					</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
					{press.map((p) => (
						<figure
							key={p.name}
							className="rounded-2xl bg-[#b81e26]/40 border border-[#d9a441]/30 p-6 backdrop-blur-sm"
						>
							<div className="flex items-center gap-2 text-[#d9a441] text-xs mb-3">
								{Array.from({ length: 5 }).map((_, i) => (
									<span key={`s-${p.name}-${i}`} className="hayati-star" />
								))}
							</div>
							<blockquote className="font-display italic text-lg leading-snug text-[#fbe5ea]">
								&ldquo;{p.quote}&rdquo;
							</blockquote>
							<figcaption className="mt-4 text-[11px] uppercase tracking-[0.3em] text-[#d9a441]/90 font-semibold">
								{p.name}
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}
