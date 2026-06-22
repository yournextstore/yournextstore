import { ArrowUpRight } from "lucide-react";
import { cacheLife } from "next/cache";
import Image from "next/image";
import { commerce } from "@/lib/commerce";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { YNSMedia } from "@/lib/yns-media";
import { YnsLink } from "../yns-link";

const tips = [
	{
		eyebrow: "Skin diary",
		title: "The five-minute evening reset.",
		image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=80",
	},
	{
		eyebrow: "Ingredient",
		title: "Why we slow-press our oils.",
		image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=600&q=80",
	},
	{
		eyebrow: "Ritual",
		title: "Wash. Steam. Pause.",
		image: "https://images.unsplash.com/photo-1583241475880-083f84372725?auto=format&fit=crop&w=600&q=80",
	},
];

export async function About() {
	"use cache";
	cacheLife("minutes");

	const bestSellers = (await commerce.productBrowse({ active: true, limit: 4 })).data;

	return (
		<section
			id="about"
			className="bg-background border-t border-foreground py-10 md:py-14 px-5 md:px-10 lg:px-16"
		>
			<div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
				{/* Latest tips and beauty hacks */}
				<article className="lg:col-span-7 neo-border bg-[var(--color-surface-container-low)] p-7 md:p-9 flex flex-col">
					<div className="flex items-start justify-between gap-6">
						<div>
							<span className="label-caps text-[var(--color-on-surface-variant)]">The journal</span>
							<h2 className="font-serif text-4xl md:text-5xl leading-[1] mt-3">
								Latest tips
								<br />
								and <span className="script-accent">beauty hacks.</span>
							</h2>
						</div>
						<YnsLink
							prefetch={"eager"}
							href="/products"
							aria-label="Read all articles"
							className="shrink-0 w-12 h-12 neo-border bg-[var(--color-surface-container-lowest)] grid place-items-center hover:bg-[var(--color-primary-container)] transition-colors"
						>
							<ArrowUpRight className="w-5 h-5" strokeWidth={1.5} />
						</YnsLink>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mt-8">
						{/* Featured tip */}
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="sm:col-span-3 group neo-border bg-[var(--color-surface-container-lowest)] overflow-hidden flex flex-col"
						>
							<div className="relative aspect-[4/3] border-b border-foreground overflow-hidden">
								<Image
									src={tips[0].image}
									alt={tips[0].title}
									fill
									sizes="(max-width: 640px) 100vw, 480px"
									className="object-cover transition-transform duration-500 group-hover:scale-105"
									unoptimized
								/>
								<span className="absolute top-3 left-3 label-caps neo-border bg-[var(--color-surface-container-lowest)] px-3 py-1.5">
									{tips[0].eyebrow}
								</span>
							</div>
							<div className="p-5 flex items-center justify-between gap-3">
								<h3 className="font-serif text-xl leading-tight">{tips[0].title}</h3>
								<ArrowUpRight
									className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
									strokeWidth={1.5}
								/>
							</div>
						</YnsLink>

						{/* Two stacked tips */}
						<div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-1 gap-4">
							{tips.slice(1).map((tip) => (
								<YnsLink
									prefetch={"eager"}
									href="/products"
									key={tip.title}
									className="group neo-border bg-[var(--color-surface-container-lowest)] flex flex-col overflow-hidden"
								>
									<div className="relative aspect-[4/3] sm:aspect-[5/3] border-b border-foreground overflow-hidden">
										<Image
											src={tip.image}
											alt={tip.title}
											fill
											sizes="(max-width: 1024px) 50vw, 240px"
											className="object-cover transition-transform duration-500 group-hover:scale-105"
											unoptimized
										/>
									</div>
									<div className="p-3 flex flex-col gap-1">
										<span className="label-caps text-[var(--color-on-surface-variant)]">{tip.eyebrow}</span>
										<h4 className="font-serif text-base leading-snug">{tip.title}</h4>
									</div>
								</YnsLink>
							))}
						</div>
					</div>
				</article>

				{/* Weekly best sellers */}
				<article className="lg:col-span-5 neo-border bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] p-7 md:p-9 flex flex-col">
					<div className="flex items-start justify-between gap-6">
						<div>
							<span className="label-caps">This week</span>
							<h2 className="font-serif text-4xl md:text-5xl leading-[1] mt-3 text-foreground">
								Our weekly
								<br />
								<span className="script-accent">best sellers.</span>
							</h2>
						</div>
						<YnsLink
							prefetch={"eager"}
							href="/products"
							aria-label="Browse all best sellers"
							className="shrink-0 w-12 h-12 neo-border bg-[var(--color-surface-container-lowest)] grid place-items-center hover:bg-foreground hover:text-background transition-colors"
						>
							<ArrowUpRight className="w-5 h-5" strokeWidth={1.5} />
						</YnsLink>
					</div>

					{bestSellers.length > 0 ? (
						<ol className="grid grid-cols-2 gap-4 mt-8">
							{bestSellers.map((product, i) => {
								const variant = product.variants?.[0];
								const image = product.images?.[0] ?? variant?.images?.[0];
								const price = variant
									? formatMoney({ amount: BigInt(variant.price), currency: CURRENCY, locale: LOCALE })
									: null;

								return (
									<li key={product.id} className="contents">
										<YnsLink
											prefetch={"eager"}
											href={`/product/${product.slug}`}
											className="group flex flex-col neo-border bg-[var(--color-surface-container-lowest)] text-foreground hover:neo-shadow transition-all"
										>
											<div className="relative aspect-square border-b border-foreground bg-[var(--color-surface-variant)] overflow-hidden">
												{image ? (
													<YNSMedia
														src={image}
														alt={product.name}
														fill
														sizes="(max-width: 1024px) 50vw, 200px"
														className="object-cover transition-transform duration-500 group-hover:scale-105"
													/>
												) : null}
												<span className="absolute top-2 left-2 label-caps neo-border bg-[var(--color-surface-container-lowest)] px-2 py-1">
													{`No. 0${i + 1}`}
												</span>
											</div>
											<div className="p-3 flex items-center justify-between gap-2">
												<h3 className="font-serif text-sm leading-snug line-clamp-2">{product.name}</h3>
												{price && (
													<span className="font-sans text-xs font-bold whitespace-nowrap">{price}</span>
												)}
											</div>
										</YnsLink>
									</li>
								);
							})}
						</ol>
					) : (
						<div className="mt-8 text-sm text-[var(--color-on-primary-container)]/80">
							Best sellers refresh weekly — check back soon.
						</div>
					)}

					<p className="font-sans text-sm leading-relaxed text-[var(--color-on-primary-container)]/80 mt-6">
						Curated by the editors. Updated every Monday at sunrise.
					</p>
				</article>
			</div>
		</section>
	);
}
