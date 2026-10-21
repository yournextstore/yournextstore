import { cacheLife } from "next/cache";
import { type HeroSlide, HeroSlider } from "@/components/sections/hero-slider";
import { getCategoryTiles, getCollectionTiles, getStoreBasics } from "@/lib/catalog";
import { HERO_IMAGES } from "@/lib/editorial";

// The original's three headlines, re-cut for a restaurant's larder; each slide opens a collection,
// then a category, then the whole shop.
const HEADLINES: [string, string][] = [
	["From our kitchen", "to your table"],
	["The pantry behind", "every service"],
	["Bring the evening", "home with you"],
];

const FALLBACK_TEXT =
	"The oils, sauces, preserves and chocolates we cook and serve with, packed for your own kitchen.";

const clip = (text: string, max = 110) => {
	if (text.length <= max) return text;
	const cut = text.slice(0, max);
	return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
};

async function getSlides(): Promise<HeroSlide[]> {
	"use cache";
	cacheLife("minutes");
	const [collections, categories, { description }] = await Promise.all([
		getCollectionTiles(3),
		getCategoryTiles(3),
		getStoreBasics(),
	]);
	const shop = { id: "shop", name: "The Shop", href: "/products", description: "" };
	const targets = [...collections, ...categories, shop].slice(0, HEADLINES.length);
	return targets.map((target, i) => ({
		id: target.id,
		kicker: target.name,
		title: HEADLINES[i] ?? HEADLINES[0] ?? ["", ""],
		text: clip(target.description || description || FALLBACK_TEXT),
		href: target.href,
		cta: target.href === "/products" ? "Shop Now" : "Discover More",
		image: HERO_IMAGES[i % HERO_IMAGES.length] ?? null,
	}));
}

export async function Hero() {
	const slides = await getSlides();
	return <HeroSlider slides={slides} />;
}
