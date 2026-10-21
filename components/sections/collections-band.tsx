import { cacheLife } from "next/cache";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { meaningfulDescription } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";

async function getFeaturedCollections() {
	"use cache";
	cacheLife("hours");
	const { data } = await commerce.collectionBrowse({ limit: 30 }).catch(() => ({ data: [] }));
	// Fullest collections first; ties keep the merchant's order.
	return [...data]
		.filter((collection) => collection.productCollections.length > 0)
		.sort((a, b) => b.productCollections.length - a.productCollections.length)
		.slice(0, 3)
		.map((collection) => ({
			slug: collection.slug,
			name: collection.name,
			count: collection.productCollections.length,
			description: meaningfulDescription(collection.name, collection.description),
		}));
}

/** The original's dark two-column band (badge, pitch, two buttons, three stacked cards), here for collections. */
export async function CollectionsBand() {
	const collections = await getFeaturedCollections();

	return (
		<section id="collections" className="scroll-mt-16 bg-ink text-white">
			<div className="shell grid gap-10 py-16 md:grid-cols-2 md:items-center md:gap-12">
				<div>
					<span className="inline-flex rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold tracking-wide uppercase text-gray-200">
						Collections
					</span>
					<h2 className="mt-4 text-2xl font-bold">Not sure where to start?</h2>
					<p className="mt-4 max-w-xl text-gray-300">
						Our collections group bags and small goods that work well together. Start with one, then mix in
						the rest of the range at your own pace.
					</p>
					<div className="mt-8 flex flex-wrap gap-4">
						<Button size="lg" asChild className="bg-white text-ink hover:bg-white/90">
							<Link href="/products">Browse all products</Link>
						</Button>
						<Button
							size="lg"
							variant="outline"
							asChild
							className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white"
						>
							<Link href="/about">Our story</Link>
						</Button>
					</div>
				</div>
				{collections.length > 0 && (
					<ul className="space-y-4">
						{collections.map((collection) => (
							<li key={collection.slug}>
								<Link
									href={`/collection/${collection.slug}`}
									className="block rounded-lg border border-white/10 bg-white/5 px-5 py-4 transition-colors hover:bg-white/10"
								>
									<span className="block font-semibold">{collection.name}</span>
									<span className="mt-1 block text-sm text-gray-300">
										{collection.count} {collection.count === 1 ? "product" : "products"}
										{collection.description ? ` · ${collection.description}` : ""}
									</span>
								</Link>
							</li>
						))}
					</ul>
				)}
			</div>
		</section>
	);
}
