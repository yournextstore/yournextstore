import type { Metadata } from "next";
import { BannerCarousel } from "@/components/sections/banner-carousel";
import { HomeProducts } from "@/components/sections/home-products";
import { ShopTiles } from "@/components/sections/shop-tiles";
import { getBannerSlides, getShopTiles, getStoreInfo } from "@/lib/catalog";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default async function Home() {
	const [slides, tiles, info] = await Promise.all([getBannerSlides(), getShopTiles(), getStoreInfo()]);
	return (
		<div className="layout pt-6 pb-24 lg:pt-8 lg:pb-32">
			<h1 className="sr-only">{info.storeName}</h1>
			{slides.length > 0 && <BannerCarousel slides={slides} />}
			<ShopTiles tiles={tiles} />
			<HomeProducts />
		</div>
	);
}
