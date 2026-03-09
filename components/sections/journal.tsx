import Image from "next/image";
import { YnsLink } from "../yns-link";

const posts = [
	{
		title: "3 days & 3 boats",
		image: "/scraped-10.png",
		date: "Jul 16, 2024",
		slug: "#",
	},
	{
		title: "Behind the design",
		image: "/scraped-11.png",
		date: "Jul 16, 2024",
		slug: "#",
	},
	{
		title: "New retail locations",
		image: "/scraped-12.png",
		date: "Jul 16, 2024",
		slug: "#",
	},
];

export function Journal() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<div className="flex items-center justify-between mb-8">
				<h2 className="font-heading text-2xl sm:text-3xl font-semibold tracking-wide">From the journal</h2>
				<YnsLink
					prefetch={"eager"}
					href="#"
					className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
				>
					View all
				</YnsLink>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
				{posts.map((post) => (
					<YnsLink prefetch={"eager"} key={post.title} href={post.slug} className="group">
						<div className="relative aspect-[4/3] overflow-hidden mb-4">
							<Image
								src={post.image}
								alt={post.title}
								fill
								sizes="(max-width: 640px) 100vw, 33vw"
								className="object-cover transition-transform duration-700 group-hover:scale-105"
							/>
						</div>
						<p className="text-xs text-muted-foreground mb-2">{post.date}</p>
						<h3 className="font-heading text-lg font-semibold tracking-wide group-hover:underline">
							{post.title}
						</h3>
					</YnsLink>
				))}
			</div>
		</section>
	);
}
