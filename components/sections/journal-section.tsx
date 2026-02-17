import Image from "next/image";
import { YnsLink } from "../yns-link";

const articles = [
	{
		title: "Interiors we love",
		date: "Jul 14, 2017",
		image: "/scraped-11.png",
		href: "#",
	},
	{
		title: "Featured designer: Alicia Hartnel",
		date: "Jul 14, 2017",
		image: "/scraped-12.png",
		href: "#",
	},
	{
		title: "Dress of the day",
		date: "Jul 14, 2017",
		image: "/scraped-13.png",
		href: "#",
	},
];

export function JournalSection() {
	return (
		<section className="bg-background py-16 sm:py-24">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between mb-12">
					<h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl text-foreground">
						From the journal
					</h2>
					<YnsLink
						prefetch={"eager"}
						href="#"
						className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
					>
						View all
					</YnsLink>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
					{articles.map((article) => (
						<YnsLink prefetch={"eager"} key={article.title} href={article.href} className="group">
							<div className="relative aspect-[4/3] overflow-hidden mb-4">
								<Image
									src={article.image}
									alt={article.title}
									fill
									className="object-cover transition-transform duration-700 group-hover:scale-105"
									sizes="(max-width: 640px) 100vw, 33vw"
								/>
							</div>
							<p className="text-xs text-muted-foreground mb-2">{article.date}</p>
							<h3 className="text-sm font-medium text-foreground group-hover:text-muted-foreground transition-colors">
								{article.title}
							</h3>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
