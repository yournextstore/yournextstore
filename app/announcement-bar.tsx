import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { getFeaturedCollection, pieces } from "@/lib/catalog";

/** One line above the header for the one thing worth knowing today: the featured collection. */
export async function AnnouncementBar() {
	const featured = await getFeaturedCollection();
	if (!featured) return null;

	return (
		<p className="flex min-h-10 flex-wrap items-center justify-center gap-x-2 gap-y-1 bg-announce px-6 py-2 text-center text-sm font-medium text-on-feature">
			<Sparkles aria-hidden="true" className="hidden size-4 sm:block" strokeWidth={1.75} />
			<span>
				New collection: {featured.name}
				{featured.count > 1 ? `, ${pieces(featured.count)}` : ""}, in the shop now
			</span>
			<Link
				href={featured.href}
				className="inline-flex items-center gap-1 font-semibold underline underline-offset-[0.2em]"
			>
				See the collection
				<ArrowRight aria-hidden="true" className="size-4" />
			</Link>
		</p>
	);
}
