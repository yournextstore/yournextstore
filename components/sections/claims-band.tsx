const claims = [
	{
		title: "Sweat-proof",
		desc: "Engineered with high-performance polymers that lock pigment in place through heat, humidity, and motion.",
	},
	{
		title: "Transfer-resistant",
		desc: "A breathable second-skin finish that stays put on clothing, masks, and pillowcases — without feeling heavy.",
	},
	{
		title: "12-hour wear",
		desc: "Clinically tested for true all-day performance, from your 6am run to your midnight encore.",
	},
];

export function ClaimsBand() {
	return (
		<section className="bg-cream">
			<div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
				<div className="editorial-divider" />
				<div className="grid grid-cols-1 divide-y divide-border/60 md:grid-cols-3 md:divide-x md:divide-y-0">
					{claims.map((c, i) => (
						<div key={c.title} className="px-2 py-12 sm:py-16 md:px-10">
							<p className="eyebrow text-bronze">0{i + 1}</p>
							<h3 className="mt-6 font-display text-3xl font-light leading-[1.05] tracking-tight text-ink sm:text-4xl">
								{c.title}.
							</h3>
							<p className="mt-5 max-w-sm text-[15px] leading-relaxed text-muted-foreground">{c.desc}</p>
						</div>
					))}
				</div>
				<div className="editorial-divider" />
			</div>
		</section>
	);
}
