import Image from "next/image";

const ENTRIES = [
	{
		image: "/scraped-1.jpg",
		category: "On the bench",
		title: "A short history of the eight-way hand-tied coil",
		excerpt:
			"Three knots, two threads, a length of waxed twine. The bench drawing has not changed since 1903 — and we like it that way.",
		date: "Spring No. 14",
	},
	{
		image: "/scraped-3.jpg",
		category: "Bed-making",
		title: "Cotton, linen, or wool — making the bed by season",
		excerpt:
			"How to dress a tufted mattress in March and again in October, with a note on the proper folding of a topsheet.",
		date: "Spring No. 13",
	},
	{
		image: "/scraped-5.jpg",
		category: "Letters",
		title: "A correspondence with the corner-stitcher",
		excerpt:
			"Margaret has been sewing the bolsters in the upstairs room since the Reagan administration. She wrote us a letter.",
		date: "Spring No. 12",
	},
];

export function Journal() {
	return (
		<section id="journal" className="bg-[var(--cream)]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="flex items-end justify-between mb-12">
					<div>
						<span className="heritage-smallcaps text-[var(--oxblood)]">The Journal</span>
						<h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl tracking-[-0.01em] text-[var(--ink)]">
							Notes from the <em className="italic">workshop</em>
						</h2>
					</div>
					<a
						href="#journal"
						className="hidden sm:inline-block heritage-smallcaps text-[var(--ink)] hover:text-[var(--oxblood)] transition-colors"
					>
						All entries →
					</a>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
					{ENTRIES.map((e, i) => (
						<article key={e.title} className="group">
							<div className="relative aspect-[5/6] overflow-hidden bg-[var(--secondary)]">
								<Image
									src={e.image}
									alt=""
									fill
									sizes="(max-width: 768px) 100vw, 33vw"
									className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
								/>
							</div>
							<div className="mt-5 flex items-center justify-between heritage-smallcaps text-[var(--ink)]/55">
								<span>{e.category}</span>
								<span className="font-display italic normal-case tracking-normal text-[13px]">{e.date}</span>
							</div>
							<h3 className="mt-3 font-display text-xl sm:text-[1.4rem] leading-tight tracking-tight text-[var(--ink)] group-hover:text-[var(--oxblood)] transition-colors">
								{e.title}
							</h3>
							<p className="mt-2 text-sm leading-relaxed text-[var(--ink)]/70 italic">{e.excerpt}</p>
							{i === 0 && (
								<span className="mt-4 inline-flex items-center gap-2 heritage-smallcaps text-[var(--oxblood)]">
									Read on
									<span aria-hidden="true">→</span>
								</span>
							)}
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
