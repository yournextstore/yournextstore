import { YnsLink } from "@/components/yns-link";

const blogPosts = [
	{
		title: "Three of the best red lipsticks for spring",
		date: "October 04, 2024",
		author: "Style Team",
		color: "#e8d5c4",
	},
	{
		title: "Blast from the past: check out the 90s fashion revival",
		date: "October 04, 2024",
		author: "Style Team",
		color: "#d4c4b0",
	},
	{
		title: "One of the best spring collections?",
		date: "October 31, 2024",
		author: "Style Team",
		color: "#c4b8a8",
	},
	{
		title: "High-street cleansing creams for everyday use",
		date: "October 31, 2024",
		author: "Style Team",
		color: "#b8a898",
	},
];

export function BlogSection() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
			<h2 className="text-sm sm:text-base font-semibold tracking-[0.15em] uppercase text-foreground mb-8">
				<YnsLink prefetch={"eager"} href="#" className="hover:text-foreground/70 transition-colors">
					World of YNS
				</YnsLink>
			</h2>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{blogPosts.map((post) => (
					<article key={post.title} className="group cursor-pointer">
						<div className="aspect-[4/3] mb-4 overflow-hidden" style={{ backgroundColor: post.color }}>
							<div className="w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
								<svg
									className="w-12 h-12 text-white/30"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="0.5"
								>
									<rect x="3" y="3" width="18" height="18" rx="2" />
									<circle cx="8.5" cy="8.5" r="1.5" />
									<path d="M21 15l-5-5L5 21" />
								</svg>
							</div>
						</div>
						<h3 className="text-sm font-medium text-foreground leading-snug mb-2 group-hover:text-foreground/70 transition-colors">
							{post.title}
						</h3>
						<p className="text-[10px] text-foreground/40 uppercase tracking-wider">
							{post.date} &mdash; {post.author}
						</p>
					</article>
				))}
			</div>
		</section>
	);
}
