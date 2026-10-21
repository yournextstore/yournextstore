import type { Metadata } from "next";
import { Banner } from "@/components/sections/banner";
import { FeatureCards } from "@/components/sections/feature-cards";
import { ProductGrid } from "@/components/sections/product-grid";
import { Separator } from "@/components/separator";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Every section is a cached read: rendered without Suspense so the whole page prerenders
// with no streamed segments (and no layout shift when they land).
export default function Home() {
	return (
		<div className="flex flex-col pt-4 page-x">
			<Banner />
			<Separator className="my-8" />
			<ProductGrid />
			<Separator className="my-8" />
			<FeatureCards />
		</div>
	);
}
