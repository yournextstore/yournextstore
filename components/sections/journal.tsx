import Image from "next/image";
import { YnsLink } from "../yns-link";

const POSTS = [
	{
		image: "/scraped-1.jpg",
		category: "Field notes",
		title: "What we found growing under the chestnut canopy",
		read: "5 min read",
	},
	{
		image: "/scraped-2.jpg",
		category: "Rituals",
		title: "A cacao + lion's mane morning to replace your second coffee",
		read: "3 min read",
	},
	{
		image: "/scraped-3.jpg",
		category: "Science",
		title: "Beta-glucans, explained without the lab coat",
		read: "7 min read",
	},
];

export function Journal() {
	return (
		<section className="bg-[color:var(--color-mush-cream)] py-20 sm:py-28">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
					<div>
						<p className="font-script text-3xl text-[color:var(--color-mush-caramel)]">From the journal</p>
						<h2 className="mt-1 font-display text-4xl sm:text-5xl text-[color:var(--color-mush-espresso)]">
							Learn the craft.
						</h2>
					</div>
					<YnsLink
						prefetch={"eager"}
						href="/faq"
						className="self-start md:self-auto inline-flex items-center gap-2 rounded-full border border-[color:var(--color-mush-espresso)]/20 px-5 py-2 font-display text-xs tracking-[0.22em] uppercase text-[color:var(--color-mush-espresso)] hover:bg-[color:var(--color-mush-espresso)] hover:text-[color:var(--color-mush-cream)] transition-colors"
					>
						All articles
					</YnsLink>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{POSTS.map((p) => (
						<article key={p.title} className="group">
							<div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[color:var(--color-mush-cream-deep)]">
								<Image
									src={p.image}
									alt=""
									fill
									sizes="(max-width: 768px) 100vw, 33vw"
									className="object-cover transition-transform duration-700 group-hover:scale-105"
								/>
								<span className="absolute top-3 left-3 rounded-full bg-[color:var(--color-mush-yellow)] px-3 py-1 font-display text-[10px] tracking-[0.2em] uppercase text-[color:var(--color-mush-espresso)]">
									{p.category}
								</span>
							</div>
							<h3 className="mt-5 font-display text-xl text-[color:var(--color-mush-espresso)] leading-snug group-hover:text-[color:var(--color-mush-caramel)] transition-colors">
								{p.title}
							</h3>
							<p className="mt-2 text-xs uppercase tracking-[0.18em] text-[color:var(--color-mush-caramel)]">
								{p.read}
							</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
