import type { Metadata } from "next";
import {
	AnnouncementBar,
	FeaturedCategoriesSection,
	HeroSection,
	NewArrivalsSection,
} from "@/components/sections/home-sections";
import { getStoreName } from "@/lib/catalog";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Cached sections render without their own Suspense boundaries: a boundary would stream them
// in after the first flush and shift the page (see the theme playbook).
export default async function Home() {
	const storeName = await getStoreName();

	return (
		<div className="flex w-full flex-col">
			<h1 className="sr-only">{storeName}</h1>
			<AnnouncementBar />
			<HeroSection />
			<NewArrivalsSection />
			<FeaturedCategoriesSection />
		</div>
	);
}
