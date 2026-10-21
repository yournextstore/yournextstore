import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { HullHero } from "@/components/sections/hull-hero";
import { HullMarquee } from "@/components/sections/hull-marquee";
import { editorial, getHomeData } from "@/lib/catalog";
import { YNSMedia } from "@/lib/yns-media";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default async function Home() {
	const { storeName, storeDescription, hero, products } = await getHomeData();

	return (
		<>
			<HullHero
				headline="Small runs. Loud rooms."
				subline="Records, tapes and merch from the artists on our label."
				cta={
					hero ? { href: hero.href, label: `Shop ${hero.label}` } : { href: "/products", label: "Shop all" }
				}
				image={editorial.hero}
			/>

			<section className="border-b border-border px-4 py-12 text-center md:p-8 md:py-16 lg:py-20">
				<div className="mx-auto max-w-3xl">
					<p className="text-h2 leading-[1.25]">
						{storeDescription ??
							`${storeName} presses records, tapes and merch for a small roster of independent artists.`}
					</p>
					<Link href="/products" className="hull-btn hull-btn-primary hull-btn-large mt-8">
						Start shopping
					</Link>
				</div>
			</section>

			{products.length > 0 && (
				<section aria-label="Featured products" className="border-b border-border">
					<HullMarquee duration={Math.max(30, products.length * 9)}>
						{products.map((product) => (
							<div key={product.id} className="-my-px flex w-[calc(80vw-2rem)] max-w-[450px] flex-col">
								<ProductCard product={product} framed sizes="(max-width: 768px) 80vw, 400px" />
							</div>
						))}
					</HullMarquee>
				</section>
			)}

			<section className="border-b border-border px-4 py-12 md:p-8 md:py-16 lg:py-20">
				<div className="grid items-center gap-12 md:grid-cols-2 md:gap-8">
					<div className="relative aspect-square overflow-hidden bg-muted">
						<YNSMedia
							src={editorial.feature}
							alt=""
							fill
							sizes="(max-width: 768px) 100vw, 50vw"
							className="object-cover"
						/>
					</div>
					<div className="mx-auto max-w-sm text-center">
						<h2 className="text-h3">Pressed in small runs</h2>
						<p className="mt-4 text-nav leading-[1.6]">
							Every release is made with the artist, in short runs on vinyl and tape, with the shirts and
							prints to match.
						</p>
						<Link
							href="/about"
							className="hull-btn hull-btn-large mt-6 [--btn-size:1.25rem] [--btn-py:0.375rem]"
						>
							Our Story
						</Link>
					</div>
				</div>
			</section>
		</>
	);
}
