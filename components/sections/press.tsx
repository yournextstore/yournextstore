const press = [
	{ name: "VOGUE", weight: 500 },
	{ name: "Kinfolk", weight: 400 },
	{ name: "THE CUT", weight: 600 },
	{ name: "Elle", weight: 500 },
	{ name: "Cereal", weight: 400 },
	{ name: "Document", weight: 500 },
	{ name: "Goop", weight: 600 },
	{ name: "Monocle", weight: 500 },
];

export function Press() {
	const repeated = [...press, ...press];
	return (
		<section className="bg-bone border-y border-ink/10">
			<div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-12">
				<p className="eyebrow text-ink/60 text-center mb-8 text-[0.65rem]">As Seen In</p>
				<div className="relative overflow-hidden">
					<div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-bone to-transparent z-10 pointer-events-none" />
					<div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-bone to-transparent z-10 pointer-events-none" />
					<div className="marquee-track flex items-center gap-16 whitespace-nowrap w-fit">
						{repeated.map((item, idx) => (
							<span
								key={`${item.name}-${idx}`}
								className="font-serif italic text-ink/55 text-2xl sm:text-3xl"
								style={{ fontWeight: item.weight }}
							>
								{item.name}
							</span>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
