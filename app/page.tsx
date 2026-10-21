import type { Metadata } from "next";
import { Carousel, ThreeItemGrid } from "@/components/bento/home-sections";
import { getStoreName } from "@/lib/listing";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default async function Home() {
	const storeName = await getStoreName();
	return (
		<>
			<h1 className="sr-only">{storeName}</h1>
			<ThreeItemGrid />
			<Carousel />
		</>
	);
}
