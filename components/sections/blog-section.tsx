import Image from "next/image";
import { YnsLink } from "../yns-link";

const blogPosts = [
	{
		title: "Revolutionizing Hydration: The Smart Tumbler",
		tag: "innovation",
		image: "/scraped-4.png",
		author: "Your Next Store",
	},
	{
		title: "Holiday Gift Guide: For Everyone on Your List",
		tag: "innovation",
		image: "/scraped-2.png",
		author: "Your Next Store",
	},
	{
		title: "3 Infused Water Recipes to Help You Stay Hydrated",
		tag: "New",
		image: "/scraped-3.png",
		author: "Your Next Store",
	},
	{
		title: "7 Creative Uses for an Insulated Shaker Bottle",
		tag: "New",
		image: "/scraped-5.png",
		author: "Your Next Store",
	},
];

export function BlogSection() {
	return (
		<section className="py-20 sm:py-28 bg-secondary/30">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-end justify-between mb-12">
					<div>
						<h2 className="text-2xl sm:text-3xl font-light tracking-tight text-foreground">Latest Stories</h2>
					</div>
					<YnsLink
						prefetch={"eager"}
						href="#"
						className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
					>
						Explore our Blogs
					</YnsLink>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{blogPosts.map((post) => (
						<article key={post.title} className="group">
							<div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-secondary mb-4">
								<Image
									src={post.image}
									alt={post.title}
									fill
									className="object-cover transition-transform duration-500 group-hover:scale-105"
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
								/>
							</div>
							<span className="text-[10px] uppercase tracking-widest text-muted-foreground bg-secondary px-2 py-1 rounded-full">
								{post.tag}
							</span>
							<h3 className="mt-3 text-sm font-medium text-foreground group-hover:underline leading-snug">
								{post.title}
							</h3>
							<p className="mt-2 text-xs text-muted-foreground">{post.author}</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
