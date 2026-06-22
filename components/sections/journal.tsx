import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

const stories = [
	{
		title: "How light shapes a room you actually want to be in",
		excerpt: "Three rules our lighting editor breaks every day — and why they work.",
		image: "/scraped-5.jpg",
		category: "Studio notes",
		minutes: "6 min read",
	},
	{
		title: "Inside a Lisbon apartment that breathes in linen",
		excerpt: "A photographer&apos;s top-floor home, styled around 11 carefully chosen pieces.",
		image: "/scraped-3.jpg",
		category: "Homes we love",
		minutes: "8 min read",
	},
	{
		title: "The brass lamp our buyers wait six months for",
		excerpt: "Hand-spun in Porto, lit in your living room. A short story of a long process.",
		image: "/scraped-0.jpg",
		category: "Maker series",
		minutes: "4 min read",
	},
];

export function Journal() {
	return (
		<section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-20 sm:pt-28">
			<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
				<div>
					<p className="text-xs tracking-[0.22em] uppercase text-muted-foreground mb-3">— The journal</p>
					<h2 className="yns-display text-4xl sm:text-5xl text-foreground leading-[1.02]">
						Stories from the studio
					</h2>
				</div>
				<YnsLink
					href="/blog"
					className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
				>
					All stories
					<ArrowUpRightIcon className="h-4 w-4" />
				</YnsLink>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{stories.map((s) => (
					<YnsLink key={s.title} href="/blog" className="group">
						<div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-secondary">
							<Image
								src={s.image}
								alt={s.title}
								fill
								sizes="(max-width: 768px) 100vw, 33vw"
								className="object-cover transition-transform duration-700 group-hover:scale-105"
							/>
							<div className="absolute top-4 left-4">
								<span className="rounded-full bg-background/90 backdrop-blur-md px-3 py-1 text-[11px] tracking-[0.16em] uppercase text-foreground">
									{s.category}
								</span>
							</div>
						</div>
						<div className="mt-5">
							<p className="text-xs tracking-[0.16em] uppercase text-muted-foreground">{s.minutes}</p>
							<h3 className="yns-display text-xl text-foreground mt-2 leading-snug group-hover:opacity-80 transition-opacity">
								{s.title}
							</h3>
							<p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.excerpt}</p>
						</div>
					</YnsLink>
				))}
			</div>
		</section>
	);
}
