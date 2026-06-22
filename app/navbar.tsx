import { cacheLife } from "next/cache";
import { SiteHeaderClient } from "@/app/site-header";
import { commerce } from "@/lib/commerce";

export async function SiteHeader() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	const collectionData = collections.data.map((c) => ({
		id: c.id,
		name: c.name,
		slug: c.slug,
	}));

	return <SiteHeaderClient collections={collectionData} />;
}
