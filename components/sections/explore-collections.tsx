import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

export async function ExploreCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 6 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<section className="py-16 sm:py-24">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight mb-10">Explore</h2>
				<div className="space-y-1">
					{collections.data.map((collection) => (
						<YnsLink
							prefetch={"eager"}
							key={collection.id}
							href={`/collection/${collection.slug}`}
							className="group flex items-center justify-between py-5 border-b border-border hover:bg-secondary/50 transition-colors px-4 -mx-4"
						>
							<span className="text-lg sm:text-xl font-bold uppercase tracking-wide">{collection.name}</span>
							<span className="text-sm text-muted-foreground font-medium">View &rarr;</span>
						</YnsLink>
					))}
				</div>
				<div className="mt-8 text-center">
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="inline-block border-2 border-foreground text-foreground px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors"
					>
						All Collections
					</YnsLink>
				</div>
			</div>
		</section>
	);
}
