import type { Metadata } from "next";
import Link from "next/link";
import { HeroCarousel } from "@/components/sections/hero-carousel";
import { ProductGrid } from "@/components/sections/product-grid";
import { getHeroSlides, getShopInfo } from "@/lib/shop";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

async function HomeAbout() {
	const shop = await getShopInfo();
	return (
		<section id="about" className="bg-background py-8">
			<div className="container mx-auto px-6 py-8">
				<h2 className="nordic-title">About</h2>
				<p className="mt-8 mb-8 leading-relaxed">
					{shop.description ??
						`${shop.storeName} is a small shop put together in the spirit of Nordic design: plain forms, honest materials and room to breathe.`}
				</p>
				<p className="mb-8 leading-relaxed">
					Every piece in the{" "}
					<Link href="/products" className="text-gray-800 underline hover:text-gray-900">
						shop
					</Link>{" "}
					is chosen to sit quietly alongside the rest: everyday things that work as hard as they look. Browse
					by category, or read more{" "}
					<Link href="/about" className="text-gray-800 underline hover:text-gray-900">
						about us
					</Link>
					.
				</p>
			</div>
		</section>
	);
}

export default async function Home() {
	// Cached reads only, so the whole home page stays in the prerendered shell.
	const [slides, shop] = await Promise.all([getHeroSlides(), getShopInfo()]);
	return (
		<>
			<h1 className="sr-only">{shop.storeName}</h1>
			{slides.length > 0 && <HeroCarousel slides={slides} />}
			<ProductGrid />
			<HomeAbout />
		</>
	);
}
