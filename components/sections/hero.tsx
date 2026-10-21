import { cacheLife } from "next/cache";
import Link from "next/link";
import { getStoreName, HERO_IMAGE } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";
import { YNSMedia } from "@/lib/yns-media";

async function getHeroData() {
	"use cache";
	cacheLife("hours");
	const [storeName, newest, all] = await Promise.all([
		getStoreName(),
		commerce.productBrowse({ active: true, limit: 24, orderBy: "createdAt", orderDirection: "desc" }),
		commerce.productBrowse({ active: true, limit: 1 }),
	]);
	// "Just arrived" lists the newest pictured, priced products.
	const listed = newest.data.filter(
		(p) => p.images.length > 0 && p.variants.some((v) => BigInt(v.price) > 0n),
	);
	return { storeName, newest: listed.slice(0, 2), count: all.meta.count };
}

const inlineLink = "underline underline-offset-2 decoration-white/70 hover:decoration-white";

/** The original's "high impact" hero: a photograph under a 55% black veil with centred rich text. */
export async function Hero() {
	const { storeName, newest, count } = await getHeroData();

	return (
		<div className="md:px-16">
			<section className="relative isolate mx-auto flex min-h-[60svh] max-w-[82rem] min-w-0 items-center justify-center overflow-hidden bg-neutral-900 text-white sm:min-h-[65vh]">
				<YNSMedia
					src={HERO_IMAGE}
					alt=""
					fill
					priority
					sizes="(max-width: 1440px) 100vw, 1312px"
					className="z-0 object-cover"
				/>
				<div className="absolute inset-0 z-[1] bg-black/55" aria-hidden="true" />

				<div className="relative z-10 w-full min-w-0 px-4 py-14 sm:py-20 md:px-8">
					<div className="mx-auto max-w-3xl min-w-0 text-center">
						<h1 className="text-3xl leading-tight font-medium text-balance sm:text-5xl">
							Paper, pens and ink for writing by hand
						</h1>
						<p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/90 sm:text-base">
							Welcome to {storeName}: {count > 0 ? `${count} products` : "a full catalogue"} chosen for
							quality, sorted by{" "}
							<Link href="/products" className={inlineLink}>
								category
							</Link>
							, with a fast and secure checkout on any device.
						</p>
						<p className="mt-5 text-sm sm:text-base">
							<Link href="/products" className={inlineLink}>
								Browse the full shop
							</Link>
						</p>

						{newest.length > 0 ? (
							<>
								<h2 className="mt-8 text-lg sm:text-xl">Just arrived</h2>
								<ul className="mt-3 space-y-2 text-sm text-white/90 sm:text-base">
									{newest.map((product) => (
										<li key={product.id}>
											<Link href={`/product/${product.slug}`} className="hover:underline">
												{product.name}
											</Link>
										</li>
									))}
								</ul>
							</>
						) : null}

						<h2 className="mt-8 text-lg sm:text-xl">Need a hand?</h2>
						<ul className="mt-3 space-y-2 text-sm text-white/90 sm:text-base">
							<li>Delivery and payment options are shown at checkout</li>
							<li>
								Answers to common questions live in our{" "}
								<Link href="/faq" className={inlineLink}>
									FAQ
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</section>
		</div>
	);
}
