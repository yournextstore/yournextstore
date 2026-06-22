import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "@/components/yns-link";

const posts = [
	{
		title: "How to size a solar array for your home in 2026",
		excerpt: "A simple framework for matching panel wattage to your real annual usage.",
		image: "/scraped-0.jpg",
		category: "Guides",
		date: "May 06",
	},
	{
		title: "Battery vs grid-tied: which setup actually pays off?",
		excerpt: "We ran the numbers across three states. The answer surprised us.",
		image: "/scraped-1.jpg",
		category: "Analysis",
		date: "Apr 22",
	},
	{
		title: "Field notes: a 12-panel install on a steep metal roof",
		excerpt: "What our crew learned from a tough mounting job in Vermont.",
		image: "/scraped-3.jpg",
		category: "Stories",
		date: "Apr 11",
	},
];

export function Blog() {
	return (
		<section className="bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
					<div>
						<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--forest)]/70 divider-leaf">
							Field journal
						</p>
						<h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
							Latest Blog
						</h2>
					</div>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="inline-flex items-center gap-2 self-start sm:self-end h-10 px-5 rounded-full bg-[var(--lime)] text-[var(--forest-deep)] text-sm font-semibold hover:brightness-95 transition"
					>
						All articles
						<ArrowRight className="h-4 w-4" />
					</YnsLink>
				</div>

				<div className="grid md:grid-cols-3 gap-6">
					{posts.map((p) => (
						<article
							key={p.title}
							className="group rounded-3xl border border-border bg-card overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
						>
							<div className="relative aspect-[16/10] overflow-hidden">
								<Image
									src={p.image}
									alt=""
									fill
									className="object-cover group-hover:scale-105 transition duration-500"
									sizes="(max-width: 768px) 100vw, 33vw"
								/>
								<div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-[var(--forest-deep)]">
									{p.category}
								</div>
							</div>
							<div className="p-5">
								<div className="text-xs text-muted-foreground">{p.date} · 4 min read</div>
								<h3 className="mt-2 text-[17px] font-semibold text-foreground leading-snug">{p.title}</h3>
								<p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.excerpt}</p>
								<div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--forest)] group-hover:text-[var(--forest-deep)]">
									Read story
									<ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
								</div>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
