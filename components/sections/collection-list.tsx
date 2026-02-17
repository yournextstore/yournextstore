import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";
import { YNSImage } from "@/lib/yns-image";
import { YnsLink } from "../yns-link";

export async function CollectionList() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 3 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 sm:py-20">
			<h2 className="font-heading text-2xl sm:text-3xl text-foreground tracking-wide text-center mb-10">
				You may also like
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
				{collections.data.map((collection) => (
					<YnsLink
						prefetch={"eager"}
						key={collection.id}
						href={`/collection/${collection.slug}`}
						className="group relative aspect-[4/3] overflow-hidden"
					>
						{collection.image ? (
							<YNSImage
								src={collection.image}
								alt={collection.name}
								fill
								className="object-cover transition-transform duration-700 group-hover:scale-105"
								sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							/>
						) : (
							<div className="absolute inset-0 bg-secondary" />
						)}
						<div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
						<div className="absolute inset-0 flex items-center justify-center">
							<span className="text-white text-sm uppercase tracking-[0.2em] font-medium">
								{collection.name}
							</span>
						</div>
					</YnsLink>
				))}
			</div>
		</section>
	);
}
