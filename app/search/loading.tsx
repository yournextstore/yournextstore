import { ListingResultsSkeleton, ListingShell } from "@/components/bento/listing";

export default function SearchLoading() {
	return (
		<ListingShell title="Search" activePath="/search">
			<ListingResultsSkeleton />
		</ListingShell>
	);
}
