import Image from "next/image";
import { YnsLink } from "@/components/yns-link";

const categories = [
	{ href: "/products?category=shirts", label: "Shirts", image: "/scraped-3.jpg" },
	{ href: "/products?category=dresses", label: "Dresses", image: "/scraped-4.jpg" },
	{ href: "/products?category=trousers", label: "Trousers", image: "/scraped-5.jpg" },
	{ href: "/products?category=knitwear", label: "Knitwear", image: "/scraped-1.jpg" },
];

export function CategoryGrid() {
	return (
		<section className="bg-background">
			<div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-24">
				<div className="flex items-end justify-between mb-10">
					<div>
						<p className="font-eyebrow text-[10px] text-muted-foreground mb-3">— Browse —</p>
						<h2 className="font-serif font-light text-foreground text-[36px] sm:text-[48px] tracking-tight leading-none">
							Shop by category
						</h2>
					</div>
					<YnsLink
						href="/products"
						className="hidden sm:inline-block font-eyebrow text-[11px] text-foreground/80 editorial-underline"
					>
						View all
					</YnsLink>
				</div>
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-10">
					{categories.map((cat) => (
						<YnsLink prefetch={"eager"} key={cat.href} href={cat.href} className="group block">
							<div className="relative aspect-[4/5] overflow-hidden bg-secondary">
								<Image
									src={cat.image}
									alt={cat.label}
									fill
									sizes="(max-width: 640px) 50vw, 25vw"
									className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
								/>
								<div className="absolute inset-0 flex items-end p-5 bg-gradient-to-t from-black/35 via-black/0 to-transparent">
									<p className="font-serif text-white text-[24px] sm:text-[28px] font-light tracking-tight">
										{cat.label}
									</p>
								</div>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
