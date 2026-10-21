import { cacheLife } from "next/cache";
import Link from "next/link";
import { editorial, getFilledCollections, getFreeShippingLabel, getStoreInfo } from "@/lib/catalog";
import { YNSMedia } from "@/lib/yns-media";

async function getHeroData() {
	"use cache";
	cacheLife("hours");
	const [store, collections, freeShipping] = await Promise.all([
		getStoreInfo(),
		getFilledCollections(),
		getFreeShippingLabel(),
	]);
	return { store, featured: collections[0] ?? null, freeShipping };
}

export async function Hero() {
	const { store, featured, freeShipping } = await getHeroData();

	return (
		<section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pt-6 pb-4 md:grid-cols-[1.1fr_1fr] md:pt-20 md:pb-16">
			<div>
				<h1 className="font-display text-[clamp(40px,6vw,72px)] leading-[0.98] font-extrabold tracking-tight">
					Gear for the bench, the desk and the first cup.
				</h1>
				<p className="mt-5 max-w-[44ch] text-[17px] leading-relaxed text-muted-foreground">
					Shop apparel, desk setup and coffee for people who make things. Hard-wearing materials, plainly
					described, quick to check out.
				</p>
				<div className="mt-8 flex flex-wrap gap-3">
					<Link
						href={featured ? `/collection/${featured.slug}` : "/products"}
						className="rounded-md bg-pine px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-pine-deep"
					>
						{featured ? `Shop ${featured.name}` : "Shop the store"}
					</Link>
					<Link
						href="/products"
						className="rounded-md border border-ink px-6 py-3.5 text-[15px] font-semibold hover:bg-tile"
					>
						All products
					</Link>
				</div>
				<p className="mt-6 text-[13px] text-muted-foreground">
					{freeShipping
						? `Free shipping over ${freeShipping}. Delivery costs are shown before you pay.`
						: "Delivery options and costs are shown at checkout, before you pay."}
				</p>
			</div>
			<div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-tile">
				<YNSMedia
					src={editorial.hero}
					alt={`A canvas shop apron and hand tools on a workbench at ${store.name}`}
					fill
					priority
					sizes="(max-width: 768px) 100vw, 510px"
					className="object-cover"
				/>
			</div>
		</section>
	);
}
