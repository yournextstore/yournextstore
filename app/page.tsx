import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Banner } from "@/components/sections/banner";
import { Hero } from "@/components/sections/hero";
import { HomeCategories } from "@/components/sections/home-categories";
import { ProductGrid } from "@/components/sections/product-grid";
import { ShopByStyle } from "@/components/sections/shop-by-style";
import { Stories } from "@/components/sections/stories";
import { getStoreName } from "@/lib/catalog";
import { meGetCached } from "@/lib/commerce";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

async function getBlogEnabled() {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached().catch(() => null);
	return me?.store.settings?.enabledTools?.blog ?? false;
}

// The original's home, top to bottom: split hero, trending row, category tiles, the black
// collection banner, shop by style, and the black "stay up to date" band. Every section is a
// cached read rendered without its own Suspense boundary, so the page prerenders whole.
export default async function Home() {
	const [storeName, blogEnabled] = await Promise.all([getStoreName(), getBlogEnabled()]);

	return (
		<div className="flex flex-col gap-8">
			<Hero storeName={storeName} />
			<ProductGrid title="Trending now" limit={4} />
			<HomeCategories />
			<Banner />
			<ShopByStyle />
			<Stories blogEnabled={blogEnabled} />
		</div>
	);
}
