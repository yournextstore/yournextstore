import type { Metadata } from "next";
import {
	BestSellers,
	FeaturedCategories,
	FeaturedProduct,
	HomeSlideshow,
	ImageGallery,
	Promises,
	PromotionGrid,
	ShopTheLookSection,
	StoryBanner,
} from "@/components/sections/home-sections";
import { Newsletter } from "@/components/sections/newsletter";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Every section reads cached catalog data only, so the whole page prerenders without Suspense
// boundaries (a boundary around a cached section still streams it late and shifts the layout).
export default function Home() {
	return (
		<>
			<HomeSlideshow />
			<BestSellers />
			<StoryBanner />
			<FeaturedCategories />
			<FeaturedProduct />
			<ShopTheLookSection />
			<PromotionGrid />
			<ImageGallery />
			<Promises />
			<Newsletter />
		</>
	);
}
