import { cacheLife } from "next/cache";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";
import { YNSImage } from "@/lib/yns-image";

export async function CategoryCards() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 3 });

	const categoryLabels = ["WOMEN'S", "MEN'S", "ACCESSORIES"];
	const categoryLinks = [
		["New In", "Sale & Special Offers", "See All"],
		["Clothing", "Beachwear", "Winter Collection"],
		["Bags", "Sunglasses", "Belts"],
	];

	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{collections.data.map((collection, index) => (
					<div key={collection.id} className="group">
						<YnsLink prefetch={"eager"} href={`/collection/${collection.slug}`} className="block">
							<div className="relative aspect-[3/4] overflow-hidden bg-secondary mb-4">
								{collection.image ? (
									<YNSImage
										src={collection.image}
										alt={collection.name}
										fill
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
										className="object-cover transition-transform duration-700 group-hover:scale-105"
									/>
								) : (
									<div className="absolute inset-0 bg-gradient-to-b from-secondary to-secondary/70" />
								)}
								<div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
							</div>
						</YnsLink>

						<div>
							<h3 className="text-sm font-semibold tracking-[0.15em] uppercase mb-3">
								<YnsLink
									prefetch={"eager"}
									href={`/collection/${collection.slug}`}
									className="hover:text-foreground/70 transition-colors"
								>
									{categoryLabels[index] ?? collection.name.toUpperCase()}
								</YnsLink>
							</h3>
							<ul className="space-y-1.5">
								{(categoryLinks[index] ?? []).map((link) => (
									<li key={link}>
										<YnsLink
											prefetch={"eager"}
											href={`/collection/${collection.slug}`}
											className="text-xs text-foreground/50 hover:text-foreground transition-colors"
										>
											{link}
										</YnsLink>
									</li>
								))}
							</ul>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
