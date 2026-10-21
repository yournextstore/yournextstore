import Image from "next/image";
import Link from "next/link";
import { Picker } from "@/components/halfstep/picker";
import { Reveals } from "@/components/halfstep/reveals";
import { ProductCard } from "@/components/product-card";
import { getHomeData } from "@/lib/catalog";
import { YNSMedia } from "@/lib/yns-media";

function SectionHead({
	kicker,
	title,
	lede,
	id,
	className = "mb-10",
}: {
	kicker: string;
	title: React.ReactNode;
	lede?: string;
	id?: string;
	className?: string;
}) {
	return (
		<div className={`max-w-[64ch] ${className}`}>
			<p className="hs-kicker mb-4" data-reveal="">
				[ {kicker} ]
			</p>
			<h2 id={id} className="hs-display hs-h2" data-reveal="">
				{title}
			</h2>
			{lede && (
				<p className="hs-lede mt-4" data-reveal="">
					{lede}
				</p>
			)}
		</div>
	);
}

export async function HomeSections() {
	const data = await getHomeData();
	const { storeName, productCount, collections, priceFrom, shipping, products, picks } = data;
	const pieces = String(productCount).padStart(2, "0");

	return (
		<Reveals>
			{/* ============ hero — the object ============ */}
			<section aria-labelledby="hero-title" className="hs-wrap pb-10 pt-10 sm:pb-16 sm:pt-16 lg:pt-20">
				<div className="grid items-center gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
					<div>
						<p className="hs-label mb-5 tracking-[0.2em]">
							[ {productCount} {productCount === 1 ? "part" : "parts"} · {collections.length}{" "}
							{collections.length === 1 ? "collection" : "collections"} · zero filler ]
						</p>
						<h1 id="hero-title" className="hs-display hs-hero-title">
							<span className="hs-rise">
								<span>Every commute,</span>
							</span>
							<span className="hs-rise">
								<span>
									<em>sorted.</em>
								</span>
							</span>
						</h1>
						<p className="mt-6 max-w-[46ch] text-muted-foreground">
							{data.storeDescription ??
								`${storeName} builds urban e-bikes and the kit around them — batteries, lights, locks, bags and rain layers — every part specced, priced and stated plainly. The parts you would pick, already picked.`}
						</p>
						<div className="mt-7 flex flex-wrap gap-3">
							<Link href="/products" className="hs-btn hs-btn-primary">
								Shop the catalogue
							</Link>
							<a href="#catalogue-title" className="hs-btn hs-btn-ghost">
								See the line-up →
							</a>
						</div>
						<dl className="mt-9 flex flex-wrap gap-x-8 gap-y-4 border-t border-line pt-5">
							<div className="flex flex-col gap-0.5">
								<dt className="hs-label text-[0.66rem]">Parts</dt>
								<dd className="hs-display text-[1.45rem] font-extrabold normal-case">{pieces}</dd>
							</div>
							{priceFrom && (
								<div className="flex flex-col gap-0.5">
									<dt className="hs-label text-[0.66rem]">From</dt>
									<dd className="hs-display text-[1.45rem] font-extrabold normal-case">{priceFrom}</dd>
								</div>
							)}
							<div className="flex flex-col gap-0.5">
								<dt className="hs-label text-[0.66rem]">Collections</dt>
								<dd className="hs-display text-[1.45rem] font-extrabold normal-case">
									{String(collections.length).padStart(2, "0")}
								</dd>
							</div>
						</dl>
					</div>
					<figure className="m-0 mx-auto w-full max-w-[560px] lg:max-w-none">
						<div className="relative aspect-[4/3] overflow-hidden rounded-xl">
							<Image
								src="/images/hero-ebike.jpg"
								alt="A graphite urban e-bike with an integrated battery, mudguards and a rear rack, side on"
								fill
								priority
								sizes="(min-width: 1024px) 640px, 100vw"
								className="object-cover"
							/>
						</div>
						<figcaption className="hs-mono mt-2 flex flex-wrap justify-between gap-x-4 text-[0.7rem] uppercase text-faint">
							<span>{storeName} — catalogue 01</span>
							<span>
								{productCount} parts{priceFrom ? ` · from ${priceFrom}` : ""}
							</span>
						</figcaption>
					</figure>
				</div>
			</section>

			{/* ============ catalogue — the part list ============ */}
			<section aria-labelledby="catalogue-title" className="hs-wrap pb-16 pt-12 sm:pb-24 sm:pt-16">
				<div className="mb-7 flex flex-wrap items-end justify-between gap-4">
					<h2 id="catalogue-title" className="hs-display hs-h3" data-reveal="">
						Every part, stated plainly.
					</h2>
					<Link href="/products" className="hs-btn hs-btn-ghost">
						All {productCount} parts →
					</Link>
				</div>
				<div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
					{products.slice(0, 6).map((product, index) => (
						<div key={product.id} data-reveal="">
							<ProductCard product={product} index={index} />
						</div>
					))}
				</div>
			</section>

			{/* ============ configurator → the picker ============ */}
			{picks.length > 0 && (
				<section id="pick" aria-labelledby="pick-title" className="hs-band py-16 sm:py-24">
					<div className="hs-wrap">
						<SectionHead
							id="pick-title"
							kicker="Configurator"
							title="One decision. We made the rest."
							lede="Pick a part. The summary, the price and the button are the real thing — straight from the catalogue, into your cart."
						/>
						<Picker items={picks} shipping={shipping} />
					</div>
				</section>
			)}

			{/* ============ collections (the range section's big watermark) ============ */}
			{collections.length > 0 && (
				<section aria-labelledby="collections-title" className="relative overflow-hidden py-16 sm:py-24">
					<span aria-hidden="true" className="hs-wm">
						{pieces} PCS
					</span>
					<div className="hs-wrap relative">
						<SectionHead
							id="collections-title"
							kicker="Collections"
							title="Sorted by how you'll use it."
							lede="Each collection is a short list, not a warehouse. Open one and everything in it belongs together."
						/>
						<div className={`grid gap-4 ${collections.length === 1 ? "" : "md:grid-cols-2"}`}>
							{collections.slice(0, collections.length === 3 ? 2 : 4).map((collection, index) => (
								<Link
									key={collection.id}
									href={`/collection/${collection.slug}`}
									className="group hs-card flex flex-col p-2.5"
									data-reveal=""
								>
									<div
										className={`hs-plate relative overflow-hidden rounded-[10px] ${collections.length === 1 ? "aspect-[16/10] md:aspect-[21/8]" : "aspect-[16/10]"}`}
									>
										{collection.image && (
											<YNSMedia
												src={collection.image}
												alt=""
												fill
												sizes="(max-width: 768px) 100vw, 50vw"
												className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
											/>
										)}
									</div>
									<div className="flex items-end justify-between gap-4 px-1.5 pb-1.5 pt-4">
										<div className="min-w-0">
											<p className="hs-kicker text-[0.7rem] tracking-[0.14em]">
												{String(index + 1).padStart(2, "0")} — collection
											</p>
											<h3 className="hs-display mt-1.5 text-[1.5rem]">{collection.name}</h3>
											{collection.description && (
												<p className="mt-1 line-clamp-2 text-[0.88rem] text-muted-foreground">
													{collection.description}
												</p>
											)}
										</div>
										<span className="hs-mono shrink-0 text-[0.75rem] text-signal">Open →</span>
									</div>
								</Link>
							))}
						</div>
					</div>
				</section>
			)}

			{/* ============ reserve → checkout band ============ */}
			<section aria-labelledby="checkout-title" className="hs-band py-16 sm:py-24">
				<div className="hs-wrap grid items-center gap-8 md:grid-cols-2 md:gap-14">
					<div>
						<p className="hs-kicker mb-4" data-reveal="">
							[ Checkout ]
						</p>
						<h2 id="checkout-title" className="hs-display hs-h2" data-reveal="">
							Checkout, stated plainly.
						</h2>
						<p className="hs-lede mb-6 mt-4 max-w-[50ch]" data-reveal="">
							No drop-down agony. Put it in the cart, see taxes and shipping, and pay at a secure checkout.
						</p>
						<ul className="hs-mono grid gap-2 text-[0.8rem] text-muted-foreground" data-reveal="">
							<li>
								<span className="text-signal">→</span> {productCount} parts in the catalogue
								{priceFrom ? `, from ${priceFrom}` : ""}
							</li>
							{shipping && (
								<li>
									<span className="text-signal">→</span> {shipping}
								</li>
							)}
							<li>
								<span className="text-signal">→</span> Taxes and shipping shown before you pay
							</li>
							<li>
								<span className="text-signal">→</span> Questions first?{" "}
								<Link href="/faq" className="underline underline-offset-2 hover:text-foreground">
									Read the FAQ
								</Link>
							</li>
						</ul>
					</div>
					<form action="/search" className="hs-panel p-5 sm:p-6" data-reveal="">
						<label htmlFor="home-search" className="hs-label mb-2 block">
							Looking for something?
						</label>
						<input
							id="home-search"
							name="q"
							type="search"
							required
							placeholder="Try “battery” or “lock”"
							className="mb-4 w-full rounded-[10px] border border-line bg-background px-3.5 py-3 text-[0.92rem] text-foreground placeholder:text-faint"
						/>
						<button type="submit" className="hs-btn hs-btn-primary hs-btn-block">
							Search the catalogue
						</button>
						<p className="hs-mono mt-3 text-center text-[0.7rem] text-faint">
							Or{" "}
							<Link href="/products" className="text-signal hover:underline">
								browse everything →
							</Link>
						</p>
					</form>
				</div>
			</section>
		</Reveals>
	);
}
