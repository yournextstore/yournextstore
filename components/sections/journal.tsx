import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

const POSTS = [
	{
		tag: "Aroma",
		title: "The story of how our famous incense fragrances are created",
		image: "/scraped-0.jpg",
		href: "/",
	},
	{
		tag: "Materials",
		title: "Natural ingredients for the manufacture of aroma candles",
		image: "/scraped-2.jpg",
		href: "/",
	},
] as const;

export function Journal() {
	return (
		<section className="bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28">
				<div className="flex items-end justify-between mb-10">
					<div>
						<span className="text-[10px] tracking-[0.28em] uppercase text-[var(--mahogany)] font-medium">
							Journal
						</span>
						<h2 className="mt-3 font-display text-3xl sm:text-4xl text-foreground leading-tight">
							From the studio.
						</h2>
					</div>
					<YnsLink
						prefetch="eager"
						href="/products"
						className="hidden sm:inline-flex items-center gap-2 h-11 px-6 rounded-full border border-foreground/40 text-[11px] tracking-[0.22em] uppercase font-medium text-foreground hover:bg-foreground hover:text-[var(--bone)] transition-colors"
					>
						All Articles
						<ArrowRight className="h-3.5 w-3.5" />
					</YnsLink>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{POSTS.map((post) => (
						<YnsLink
							key={post.title}
							prefetch="eager"
							href={post.href}
							className="group block rounded-2xl border border-border bg-[var(--bone)] overflow-hidden"
						>
							<div className="relative aspect-[16/10] overflow-hidden">
								<Image
									src={post.image}
									alt={post.title}
									fill
									sizes="(max-width: 768px) 100vw, 50vw"
									className="object-cover transition-transform duration-700 group-hover:scale-105"
								/>
							</div>
							<div className="p-7">
								<span className="inline-flex items-center rounded-full bg-[var(--sand)] text-[var(--mahogany)] text-[10px] tracking-[0.18em] uppercase font-medium px-3 py-1">
									{post.tag}
								</span>
								<h3 className="mt-4 font-display text-2xl sm:text-[26px] leading-snug text-foreground">
									{post.title}
								</h3>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
