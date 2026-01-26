import { cacheLife } from "next/cache";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="text-sm font-semibold text-foreground">Collections</h3>
			<ul className="mt-4 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							{collection.name}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

export function Footer() {
	return (
		<footer className="border-t border-border bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-12 sm:py-16 flex flex-col sm:flex-row gap-8 sm:gap-16">
					{/* Brand */}
					<div className="sm:max-w-xs">
						<YnsLink prefetch={"eager"} href="/" className="text-xl font-bold text-foreground">
							Your Next Store
						</YnsLink>
						<p className="mt-4 text-sm text-muted-foreground leading-relaxed">
							Curated essentials for modern living. Quality products, thoughtfully designed.
						</p>
					</div>

					{/* Collections */}
					<FooterCollections />
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-border">
					<p className="text-sm text-muted-foreground">
						&copy; {new Date().getFullYear()} Your Next Store. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
