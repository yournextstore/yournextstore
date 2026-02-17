import Image from "next/image";

const posts = [
	{
		title: "3 days & 3 boats",
		date: "Jul 16, 2024",
		image: "/scraped-10.png",
	},
	{
		title: "Behind the design",
		date: "Jul 16, 2024",
		image: "/scraped-11.png",
	},
	{
		title: "New retail locations",
		date: "Jul 16, 2024",
		image: "/scraped-12.png",
	},
];

export function Journal() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="flex items-center justify-between mb-12">
				<h2 className="font-heading text-2xl sm:text-3xl font-bold">From the journal</h2>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{posts.map((post) => (
					<article key={post.title} className="group cursor-pointer">
						<div className="relative aspect-[3/2] overflow-hidden bg-secondary mb-4">
							<Image
								src={post.image}
								alt={post.title}
								fill
								className="object-cover transition-transform duration-700 group-hover:scale-105"
								sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							/>
						</div>
						<p className="text-xs text-muted-foreground mb-2">{post.date}</p>
						<h3 className="text-lg font-medium group-hover:underline">{post.title}</h3>
					</article>
				))}
			</div>
		</section>
	);
}
