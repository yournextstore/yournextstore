import { ListingHeading, ListingResultsSkeleton, ListingShell } from "@/components/bento/listing";

export default function SearchLoading() {
	return (
		<ListingShell activePath="/search">
			<ListingResultsSkeleton
				before={<ListingHeading title="Search">Looking through the catalog…</ListingHeading>}
			/>
		</ListingShell>
	);
}
