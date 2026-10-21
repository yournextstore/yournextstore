import { getCollections, getStoreInfo, PHOTOS } from "@/lib/catalog";
import { HeroCarousel, type HeroSlide } from "./hero-carousel";

/** A collection named after the store ("Acme Basics" in Acme) reads "Basics" on the poster. */
export function shortName(name: string, storeName: string) {
	const prefix = `${storeName.toLowerCase()} `;
	const stripped = name.toLowerCase().startsWith(prefix) ? name.slice(prefix.length).trim() : name;
	return stripped || name;
}

/** Slide 1 is the store itself; then one slide per collection, each over a bundled Pexels photo. */
export async function Hero() {
	const [{ storeName }, collections] = await Promise.all([getStoreInfo(), getCollections()]);
	const slides: HeroSlide[] = [
		{
			key: "store",
			title: storeName,
			script: ["Fuel the Work", "Then Do the Work"],
			href: "/products",
			cta: "Shop now",
			image: PHOTOS.hero[0],
		},
		...collections.slice(0, PHOTOS.hero.length - 1).map((collection, index) => ({
			key: collection.slug,
			title: shortName(collection.name, storeName),
			script: ["Discover", "the Collection"] as [string, string],
			href: `/collection/${collection.slug}`,
			cta: "Shop now",
			image: PHOTOS.hero[index + 1] ?? PHOTOS.hero[0],
		})),
	];
	return <HeroCarousel slides={slides} />;
}
