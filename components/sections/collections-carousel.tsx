import { cacheLife } from "next/cache";
import Image from "next/image";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

const collectionImages = ["/scraped-3.jpg", "/scraped-0.jpg", "/scraped-7.jpg", "/scraped-2.jpg"];

export async function CollectionsCarousel() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 4 });
	const items = collections.data;

	if (items.length === 0) {
		return null;
	}

	return (
		<section className="py-16 sm:py-24 bg-secondary/30">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-10">
					<p className="text-sm tracking-widest uppercase text-muted-foreground mb-2">Care for your skin</p>
					<h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-light text-foreground">
						Natural self care products
					</h2>
					<p className="mt-4 text-muted-foreground max-w-xl mx-auto">
						We create safe products that really work and are designed to make you feel good
					</p>
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
					{items.map((collection, idx) => (
						<YnsLink
							key={collection.id}
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="group"
						>
							<div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3">
								<Image
									src={collectionImages[idx % collectionImages.length] ?? collectionImages[0]}
									alt={collection.name}
									fill
									className="object-cover transition-transform duration-500 group-hover:scale-105"
									sizes="(max-width: 640px) 50vw, 25vw"
								/>
								<div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
							</div>
							<h3 className="text-sm font-semibold text-foreground">{collection.name}</h3>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
