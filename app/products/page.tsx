import type { Metadata } from "next";
import { Archive } from "@/components/maison/archive";
import { ArchiveHero } from "@/components/maison/archive-hero";
import { ActiveTab } from "@/components/maison/house-strip";
import { getArchivePieces, heroTiles } from "@/lib/catalog";
import { getStoreSeo } from "@/lib/commerce";
import { REGISTER_PLATES } from "@/lib/editorial";

export async function generateMetadata(): Promise<Metadata> {
	const { storeName, storeDescription } = await getStoreSeo();
	const title = "All pieces";
	const description = storeDescription
		? `The complete ${storeName} archive. ${storeDescription}`
		: `The complete ${storeName} archive.`;
	return {
		title,
		description,
		alternates: { canonical: "/products" },
		openGraph: { type: "website", title, description, url: "/products" },
	};
}

export default async function ProductsPage() {
	const [pieces, tiles] = await Promise.all([getArchivePieces(), heroTiles(REGISTER_PLATES, 4)]);

	return (
		<div className="mx-auto max-w-[1240px] px-4 sm:px-6">
			<ActiveTab tab="all" />
			<ArchiveHero
				kicker="The register"
				title="All pieces"
				blurb={`${pieces.length} ${pieces.length === 1 ? "piece" : "pieces"} in the archive, newest entries first. Narrow them by department, valuation or availability, or open any record for its full specification.`}
				tiles={tiles}
			/>
			<Archive pieces={pieces} />
		</div>
	);
}
