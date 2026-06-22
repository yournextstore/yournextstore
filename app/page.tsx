import type { Metadata } from "next";
import { Suspense } from "react";
import { CollectionsShowcase } from "@/components/sections/collections-showcase";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Hero } from "@/components/sections/hero";
import { ImageCardBanner } from "@/components/sections/image-card-banner";
import { ProductGrid } from "@/components/sections/product-grid";
import { PromoBanner } from "@/components/sections/promo-banner";
import { TextWithImages } from "@/components/sections/text-with-images";
import { TrustStrip } from "@/components/sections/trust-strip";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<main>
			<Hero />
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="What's Hot" description="Our most loved products this season" limit={8} />
			<TextWithImages />
			<Suspense>
				<CollectionsShowcase />
			</Suspense>
			<PromoBanner />
			<TrustStrip />
			<CtaBanner />
			<ImageCardBanner />
		</main>
	);
}
