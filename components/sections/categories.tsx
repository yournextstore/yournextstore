import Image from "next/image";
import { YnsLink } from "../yns-link";

const CATEGORIES = [
	{
		title: "Shampoo",
		blurb: "Gentle botanical washes",
		image: "/scraped-1.jpg",
		href: "/products",
	},
	{
		title: "Conditioner",
		blurb: "Soft, silky finishes",
		image: "/scraped-2.jpg",
		href: "/products",
	},
	{
		title: "Grooming Essentials",
		blurb: "Brushes, balms, bandanas",
		image: "/scraped-3.jpg",
		href: "/products",
	},
] as const;

export function Categories() {
	return (
		<section className="bg-background">
			<div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
				<div className="mb-12 text-center">
					<p className="text-[11px] yns-letter-spacing-mid uppercase text-muted-foreground">
						Shop the ritual
					</p>
					<h2 className="mt-3 font-serif text-4xl sm:text-5xl font-light text-foreground">
						The <em className="italic">essentials</em>
					</h2>
				</div>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
					{CATEGORIES.map((c) => (
						<YnsLink
							key={c.title}
							prefetch="eager"
							href={c.href}
							className="group block rounded-md bg-secondary"
						>
							<div className="relative aspect-[4/5] overflow-hidden rounded-md">
								<Image
									src={c.image}
									alt={c.title}
									fill
									sizes="(max-width: 768px) 100vw, 33vw"
									className="object-cover transition-transform duration-700 group-hover:scale-105"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-[#3B3A33]/30 via-transparent to-transparent" />
								<div className="absolute inset-x-0 bottom-0 p-6 text-[#F5F1EB]">
									<h3 className="font-serif text-2xl sm:text-3xl italic font-light">{c.title}</h3>
									<p className="mt-1 text-xs tracking-wide opacity-90">{c.blurb}</p>
								</div>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
