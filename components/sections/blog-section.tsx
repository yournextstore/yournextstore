import Image from "next/image";
import { YnsLink } from "../yns-link";

const blogPosts = [
	{
		image: "/scraped-8.png",
		date: "September 25, 2024",
		author: "YNS Admin",
		title: "The Century GRMN Is The Superhero",
		excerpt:
			"Discover the latest innovations in automotive performance. From advanced engineering to cutting-edge design, explore what makes modern vehicles stand out.",
		href: "/products",
	},
	{
		image: "/scraped-9.png",
		date: "September 25, 2024",
		author: "YNS Admin",
		title: "The Grandest Land Cruiser Has Arrived",
		excerpt:
			"Experience the ultimate in off-road capability and luxury. See how the latest models push boundaries in both performance and comfort.",
		href: "/products",
	},
];

export function BlogSection() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<h2 className="font-heading text-2xl font-bold uppercase tracking-wide mb-8">Blog News</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{blogPosts.map((post) => (
					<article key={post.title} className="group flex flex-col sm:flex-row gap-4">
						<YnsLink
							prefetch={"eager"}
							href={post.href}
							className="relative flex-shrink-0 w-full sm:w-48 h-40 overflow-hidden"
						>
							<Image
								src={post.image}
								alt={post.title}
								fill
								className="object-cover transition-transform duration-500 group-hover:scale-105"
								sizes="(max-width: 640px) 100vw, 192px"
							/>
						</YnsLink>
						<div className="flex flex-col justify-center">
							<p className="text-xs text-muted-foreground">
								{post.date} &mdash; {post.author}
							</p>
							<h3 className="mt-1 font-heading text-base font-bold uppercase leading-tight">
								<YnsLink prefetch={"eager"} href={post.href} className="hover:text-brand transition-colors">
									{post.title}
								</YnsLink>
							</h3>
							<p className="mt-2 text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
							<YnsLink
								prefetch={"eager"}
								href={post.href}
								className="mt-2 text-xs font-semibold uppercase tracking-wider text-brand hover:text-yellow-600 transition-colors"
							>
								Read More
							</YnsLink>
						</div>
					</article>
				))}
			</div>
		</section>
	);
}
