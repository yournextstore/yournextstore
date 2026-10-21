import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { getCategoryShowcases, getHomeProducts, getStoreIdentity, styledShot } from "@/lib/catalog";
import { getStoreSeo } from "@/lib/commerce";
import { sentenceCase } from "@/lib/display";
import { EDITORIAL } from "@/lib/editorial";
import { JsonLdScript } from "@/lib/json-ld";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

// `next dev` and `next build` fail if anything on this route renders per request (AGENTS.md).
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const { storeName, storeDescription } = await getStoreSeo();
	const description = storeDescription
		? `Learn more about ${storeName}. ${storeDescription}`
		: `Learn about ${storeName}: what we offer and the ideas behind it.`;

	return {
		title: "Showcase",
		description,
		alternates: { canonical: "/about" },
		openGraph: { type: "website", title: "Showcase", description, url: "/about" },
	};
}

const PHOTO = "relative overflow-hidden rounded-lg bg-gray-100";
const UNDERLINE =
	"border-b border-gray-800 pb-0.5 text-sm text-gray-800 transition-colors hover:border-sky-deep hover:text-ink";

/** The original's "Showcase" page: an editorial about page in a lighter register than the home. */
export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const [identity, showcases, { arrivals }, config] = await Promise.all([
		getStoreIdentity(),
		getCategoryShowcases(),
		getHomeProducts(),
		getStoreConfig(),
	]);
	const { storeName, storeDescription } = identity;
	const frames = EDITORIAL.about;
	const tiles = showcases.slice(0, 3);
	const products = arrivals.slice(3, 7).length === 4 ? arrivals.slice(3, 7) : arrivals.slice(0, 4);

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${storeName}`,
		description: storeDescription ?? "What we offer and the ideas behind it.",
	};

	return (
		<div className="pb-16">
			<JsonLdScript data={aboutJsonLd} />
			<h1 className="mx-auto max-w-3xl px-6 pb-12 pt-12 text-center text-3xl font-light leading-tight text-gray-800 md:pb-16 md:pt-20 md:text-5xl">
				A wardrobe that changes with the seasons
			</h1>

			<section className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2 md:gap-12 lg:px-16">
				<div>
					<div className={cn(PHOTO, "aspect-[2/3] md:aspect-[57/90]")}>
						{frames[0] && (
							<YNSMedia
								src={frames[0]}
								alt=""
								fill
								priority
								sizes="(max-width: 768px) 90vw, 45vw"
								className="object-cover"
							/>
						)}
					</div>
					<div className="px-4 py-10 md:px-8">
						<p className="max-w-md text-sm leading-relaxed text-gray-700">
							{storeDescription ??
								`${storeName} brings together versatile everyday products and accessories that lift personal style in any setting.`}
						</p>
						<Link href="/products" className={cn(UNDERLINE, "mt-8 inline-block")}>
							Shop all our products
						</Link>
					</div>
				</div>
				<div className={cn(PHOTO, "aspect-[2/3] md:mt-16 md:aspect-[57/90]")}>
					{frames[1] && (
						<YNSMedia
							src={frames[1]}
							alt=""
							fill
							sizes="(max-width: 768px) 90vw, 45vw"
							className="object-cover"
						/>
					)}
				</div>
			</section>

			{tiles.length > 0 && (
				<section aria-label="Categories" className="mx-auto max-w-5xl px-6 py-16 md:py-24">
					<ul className="grid gap-8 sm:grid-cols-3 sm:gap-12">
						{tiles.map((tile) => (
							<li key={tile.slug}>
								<Link
									href={`/category/${tile.slug}`}
									className={cn(PHOTO, "group block h-72 bg-gray-800 sm:h-56 lg:h-72")}
								>
									{tile.frames[0] && (
										<YNSMedia
											src={tile.frames[0]}
											alt=""
											fill
											sizes="(max-width: 640px) 90vw, 30vw"
											className="object-cover object-[50%_25%] transition-transform duration-500 group-hover:scale-105"
										/>
									)}
									<span
										aria-hidden
										className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-transparent"
									/>
									<span className="absolute right-4 top-3 flex flex-col items-end gap-2 text-right text-white">
										<span className="text-2xl font-light leading-tight">{sentenceCase(tile.name)}</span>
										<span className="border-b border-white pb-0.5 text-sm">Shop now</span>
									</span>
								</Link>
							</li>
						))}
					</ul>
				</section>
			)}

			{products.length > 0 && (
				<section aria-labelledby="arrivals-heading" className="mx-auto max-w-6xl px-6 lg:px-16">
					<div className="grid gap-12 md:grid-cols-2">
						{products.map((product, index) => {
							const image = styledShot(product.images) ?? product.images[0];
							const { min } = priceRange(product.variants, config.taxBehavior);
							return (
								<div key={product.id}>
									{index === 0 && (
										<h2
											id="arrivals-heading"
											className="mb-12 px-6 text-3xl font-light text-gray-800 md:text-4xl"
										>
											New Arrivals
										</h2>
									)}
									<Link href={`/product/${product.slug}`} className="group block">
										<span className={cn(PHOTO, "block aspect-[57/70]")}>
											{image && (
												<YNSMedia
													src={image}
													alt=""
													fill
													sizes="(max-width: 768px) 90vw, 45vw"
													className="object-cover object-[50%_30%] transition-transform duration-500 group-hover:scale-[1.02]"
												/>
											)}
										</span>
										<span className="mt-4 block text-sm text-gray-900">{product.name}</span>
										{product.variants.length > 0 && (
											<span className="block text-sm text-gray-700">
												{formatMoney({ amount: min, currency: config.currency, locale: config.locale })}
											</span>
										)}
									</Link>
								</div>
							);
						})}
					</div>
				</section>
			)}

			<section aria-labelledby="materials-heading" className="mx-auto mt-24 max-w-6xl px-6 lg:px-16">
				<div className="grid gap-12 md:grid-cols-2">
					<div>
						<h2
							id="materials-heading"
							className="px-6 text-3xl font-light leading-tight text-gray-800 md:text-4xl"
						>
							Wool, linen, denim and silk
						</h2>
						<div className={cn(PHOTO, "mt-12 aspect-[4/3]")}>
							{frames[2] && (
								<YNSMedia
									src={frames[2]}
									alt=""
									fill
									sizes="(max-width: 768px) 90vw, 40vw"
									className="object-cover object-[50%_30%]"
								/>
							)}
						</div>
					</div>
					<div className="md:pt-32">
						<div className={cn(PHOTO, "aspect-[4/3]")}>
							{frames[3] && (
								<YNSMedia
									src={frames[3]}
									alt=""
									fill
									sizes="(max-width: 768px) 90vw, 40vw"
									className="object-cover object-[50%_30%]"
								/>
							)}
						</div>
						<p className="mx-auto mt-12 max-w-md px-6 text-sm leading-relaxed text-gray-700">
							Each season gets a small edit: lambswool and quilting for winter, linen and cotton for summer,
							denim and fine knits for the months in between. We name the fibre and the fit of every piece so
							you know what you are buying.
						</p>
					</div>
				</div>
			</section>
		</div>
	);
}
