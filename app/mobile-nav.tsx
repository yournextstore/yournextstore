import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";
import { MobileNavSheet } from "./mobile-nav-sheet";

export async function MobileNav() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	return <MobileNavSheet collections={collections.data} />;
}
