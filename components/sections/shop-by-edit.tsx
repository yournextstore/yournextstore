import Image from "next/image";
import { YnsLink } from "../yns-link";

const EDITS = [
	{ title: "Sun-Bleached Linens", image: "/scraped-4.jpg", href: "/products" },
	{ title: "Print & Pattern", image: "/scraped-3.jpg", href: "/products" },
	{ title: "Mediterranean Days", image: "/scraped-2.jpg", href: "/products" },
	{ title: "Heritage Embroidery", image: "/scraped-0.jpg", href: "/products" },
	{ title: "Boho Essentials", image: "/scraped-1.jpg", href: "/products" },
	{ title: "Wildflower Meadow", image: "/scraped-5.jpg", href: "/products" },
];

export function ShopByEdit() {
	return (
		<section id="edits" className="bg-cream/60 border-y border-border/60">
			<div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-20">
				<div className="flex items-end justify-between mb-8 sm:mb-12">
					<div>
						<p className="text-[11px] tracking-[0.32em] uppercase text-muted-foreground mb-3">
							Curated For You
						</p>
						<h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink">Shop By Edit</h2>
					</div>
					<YnsLink
						prefetch="eager"
						href="/products"
						className="hidden sm:inline-block text-[11px] tracking-[0.22em] uppercase text-ink/80 border-b border-ink/30 pb-0.5 hover:text-ink hover:border-ink transition-colors"
					>
						View All Edits
					</YnsLink>
				</div>

				<div className="flex gap-4 sm:gap-6 overflow-x-auto pb-2 -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 snap-x snap-mandatory scrollbar-none">
					{EDITS.map((edit) => (
						<YnsLink
							key={edit.title}
							prefetch="eager"
							href={edit.href}
							className="group relative shrink-0 w-[68%] sm:w-[42%] lg:w-[24%] snap-start"
						>
							<div className="relative aspect-[3/4] overflow-hidden bg-stone/40 rounded-sm">
								<Image
									src={edit.image}
									alt={edit.title}
									fill
									sizes="(max-width: 640px) 70vw, (max-width: 1024px) 42vw, 24vw"
									className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
							</div>
							<div className="mt-4 flex items-center justify-between">
								<h3 className="font-serif text-lg sm:text-xl text-ink">{edit.title}</h3>
								<span className="text-[10px] tracking-[0.24em] uppercase text-ink/60 group-hover:text-ink transition-colors">
									Shop →
								</span>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
