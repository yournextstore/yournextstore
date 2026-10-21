import type { Metadata } from "next";
import { Archive } from "@/components/maison/archive";
import { ArchiveHero } from "@/components/maison/archive-hero";
import { ActiveTab } from "@/components/maison/house-strip";
import { getArchivePieces, getStoreIdentity, heroTiles } from "@/lib/catalog";
import { HOME_PLATES } from "@/lib/editorial";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default async function Home() {
	const [pieces, tiles, identity] = await Promise.all([
		getArchivePieces(),
		heroTiles(HOME_PLATES),
		getStoreIdentity(),
	]);

	return (
		<div className="mx-auto max-w-[1240px] px-4 sm:px-6">
			<ActiveTab tab="all" />
			<ArchiveHero
				kicker="Archive editions"
				title="Hand-finished pieces, catalogued one by one"
				blurb={
					identity.storeDescription ??
					"Every piece in the register is photographed, measured and described before it is offered. Browse the archive below, or open a record for its full specification."
				}
				tiles={tiles}
			/>
			<Archive pieces={pieces} />
		</div>
	);
}
