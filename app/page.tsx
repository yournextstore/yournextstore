import type { Metadata } from "next";
import Link from "next/link";
import { ArtPhoto } from "@/components/art-photo";
import { ArrowCircle } from "@/components/isle";
import { CategoryShowcase } from "@/components/sections/category-showcase";
import { CollectionRows } from "@/components/sections/collection-rows";
import { Hero } from "@/components/sections/hero";

const shopAll = { src: "/images/pexels/shop-all.jpg", width: 2000, height: 1333 };
const shopAllMobile = { src: "/images/pexels/shop-all-mobile.jpg", width: 900, height: 1600 };

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

// Cached sections render without a Suspense boundary of their own: a boundary would stream them
// after the first flush and shift the page (PLAYBOOK §4).
export default function Home() {
	return (
		<>
			<Hero headline="Considered Design, Uncompromised Quality" />
			<CollectionRows />
			<Link
				href="/products"
				className="relative mx-1 mt-1 block h-[calc(100svh-8px)] min-h-[30rem] overflow-hidden rounded-sm text-white"
			>
				<ArtPhoto
					wide={shopAll}
					tall={shopAllMobile}
					alt="Leather lounge chairs, a glass coffee table and an arc floor lamp in a dark room"
				/>
				<span className="absolute inset-x-2 top-1/2 flex -translate-y-1/2 items-center justify-between text-title">
					Shop All
					<ArrowCircle tone="light" />
				</span>
			</Link>
			<CategoryShowcase />
		</>
	);
}
