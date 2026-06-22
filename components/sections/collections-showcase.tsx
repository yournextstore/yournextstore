import { cacheLife } from "next/cache";
import Image from "next/image";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

export async function CollectionsShowcase() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 4 });

	const collectionImages = ["/scraped-5.jpg", "/scraped-9.jpg", "/scraped-7.jpg", "/scraped-0.jpg"];

	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<div className="text-center mb-10">
				<p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">Care for your skin</p>
				<h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide">
					Natural self care products
				</h2>
				<p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
					We create safe products that really work and are designed to make you feel good
				</p>
			</div>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				{collections.data.map((collection, i) => (
					<YnsLink
						prefetch={"eager"}
						key={collection.id}
						href={`/collection/${collection.slug}`}
						className="group relative aspect-[3/4] rounded-lg overflow-hidden"
					>
						<Image
							src={collectionImages[i % collectionImages.length]}
							alt={collection.name}
							fill
							className="object-cover transition-transform duration-500 group-hover:scale-105"
							sizes="(max-width: 640px) 50vw, 25vw"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
						<div className="absolute bottom-0 left-0 right-0 p-4">
							<p className="text-white font-medium text-sm">{collection.name}</p>
							<p className="text-white/70 text-xs mt-0.5">
								{collection.productCollections?.length ?? 0} items
							</p>
						</div>
					</YnsLink>
				))}
			</div>
		</section>
	);
}
