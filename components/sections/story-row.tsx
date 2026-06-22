import Image from "next/image";
import { YnsLink } from "../yns-link";

const stories = [
	{
		eyebrow: "The Goods",
		title: "Slow-made finds",
		body: "Pieces with weight, grain, and patience. Sourced one workshop at a time, never by container.",
		image: "/scraped-0.jpg",
		stamp: "01",
	},
	{
		eyebrow: "The Ritual",
		title: "An afternoon, unhurried",
		body: "Linen on the table, citrus in a bowl, an ice cube clinking against glass. The kind of object earns its place.",
		image: "/scraped-1.jpg",
		stamp: "02",
	},
	{
		eyebrow: "The Place",
		title: "Mediterranean in spirit",
		body: "Built on the colour of a chipped tile in the back garden of a trattoria, the cobalt of a shutter at noon.",
		image: "/scraped-2.jpg",
		stamp: "03",
	},
];

export function StoryRow() {
	return (
		<section className="bg-paper border-y border-[#d8c4a8]/60">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
					<div>
						<p className="font-script text-[#1f46c2] text-2xl sm:text-3xl leading-none">postcards from</p>
						<h2 className="mt-1 font-display text-4xl sm:text-5xl text-[#2a2622] uppercase tracking-wide">
							a curated edit
						</h2>
					</div>
					<p className="max-w-md text-sm text-[#6b5e4e] leading-relaxed">
						Three short stories about how the shop came to look the way it does — and why every object has to
						pass the same lazy-Sunday test.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
					{stories.map((s) => (
						<article
							key={s.eyebrow}
							className="group relative bg-[#fbf3e6] border border-[#d8c4a8] rounded-sm overflow-hidden shadow-[0_2px_0_rgba(42,38,34,0.08)] hover:shadow-[0_18px_30px_-20px_rgba(31,70,194,0.45)] transition-all duration-300"
						>
							<div className="relative aspect-[4/5] overflow-hidden bg-[#ecd3b8]">
								<Image
									src={s.image}
									alt={s.title}
									fill
									sizes="(max-width: 768px) 100vw, 33vw"
									className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-[#2a2622]/40 via-transparent to-transparent" />
								<div className="absolute top-4 left-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-[#f5e4d2]">
									<span className="font-display text-2xl text-[#e8b547] leading-none">{s.stamp}</span>
									<span>· {s.eyebrow}</span>
								</div>
							</div>
							<div className="p-6 sm:p-7">
								<h3 className="font-display text-2xl sm:text-[26px] text-[#2a2622] leading-snug">
									{s.title}
								</h3>
								<p className="mt-3 text-sm text-[#6b5e4e] leading-relaxed">{s.body}</p>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="mt-5 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] font-medium text-[#1f46c2] hover:text-[#d8351f] transition-colors"
								>
									Read the page
									<span aria-hidden>→</span>
								</YnsLink>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
