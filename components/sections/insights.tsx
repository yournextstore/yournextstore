import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

const posts = [
	{
		image: "/scraped-1.jpg",
		category: "Materials",
		date: "May · 4 min",
		title: "Why solid oak still belongs in a quiet home",
	},
	{
		image: "/scraped-2.jpg",
		category: "Atelier visit",
		date: "April · 6 min",
		title: "Inside the Porto studio shaping our boucle lounger",
	},
	{
		image: "/scraped-3.jpg",
		category: "Slow living",
		date: "March · 5 min",
		title: "Designing a reading nook for late-afternoon light",
	},
];

export function Insights() {
	return (
		<section id="story" className="bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
					<div className="max-w-2xl">
						<div className="text-[11px] uppercase tracking-[0.22em] text-[#c8a57a] mb-3">— Journal</div>
						<h2 className="font-display text-4xl sm:text-5xl tracking-[-0.015em] text-[#1f2933] leading-[1.05]">
							We Collect the Most Trending <br />
							<span className="italic font-light text-[#1f2933]/85">and Best Furniture in Our Store</span>
						</h2>
					</div>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="group inline-flex items-center gap-2 self-start sm:self-end rounded-full border border-[#1f2933]/15 px-5 py-2.5 text-sm font-medium text-[#1f2933] hover:bg-[#1f2933] hover:text-[#f5f1ea] transition-colors"
					>
						Read the journal
						<ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
					</YnsLink>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
					{posts.map((p) => (
						<article key={p.title} className="group">
							<div className="relative aspect-[4/3] overflow-hidden rounded-[24px] ring-1 ring-[#1f2933]/5">
								<Image
									src={p.image}
									alt={p.title}
									fill
									sizes="(max-width: 768px) 100vw, 33vw"
									className="object-cover transition-transform duration-700 group-hover:scale-105"
								/>
							</div>
							<div className="mt-5 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#1f2933]/55">
								<span>{p.category}</span>
								<span className="h-1 w-1 rounded-full bg-[#c8a57a]" />
								<span>{p.date}</span>
							</div>
							<h3 className="mt-2 font-display text-2xl text-[#1f2933] tracking-[-0.01em] leading-snug">
								{p.title}
							</h3>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
