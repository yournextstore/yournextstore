const press = [
	{ name: "Bon Appétit", quote: "“The bottled afternoon we didn't know we needed.”" },
	{ name: "Eater", quote: "“A small revolution in the soda aisle.”" },
	{ name: "Cherry Bombe", quote: "“Bright, grown-up, and properly fizzy.”" },
	{ name: "Food & Wine", quote: "“Espresso, reimagined for a sunset hour.”" },
];

export function Press() {
	return (
		<section className="bg-background border-y border-border">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14">
				<p className="text-center text-[11px] uppercase tracking-[0.28em] text-espresso/60 mb-10">
					As featured in
				</p>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
					{press.map((p) => (
						<div key={p.name} className="text-center">
							<p className="font-display text-2xl sm:text-3xl text-espresso mb-3">{p.name}</p>
							<p className="text-xs text-espresso/55 italic leading-relaxed max-w-[16rem] mx-auto">
								{p.quote}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
