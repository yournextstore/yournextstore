import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";
import { YNSImage } from "@/lib/yns-image";
import { YnsLink } from "../yns-link";

export async function TopCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 6 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<section className="py-14 sm:py-20">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-10">
					<h2 className="font-heading text-2xl sm:text-3xl font-medium text-foreground">Top Collections</h2>
					<p className="mt-2 text-sm text-muted-foreground">
						Express your style with our standout collection—fashion meets sophistication.
					</p>
				</div>
				<div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8">
					{collections.data.map((collection) => {
						const image = collection.image;
						return (
							<YnsLink
								prefetch={"eager"}
								key={collection.id}
								href={`/collection/${collection.slug}`}
								className="group flex flex-col items-center gap-3"
							>
								<div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-secondary border-2 border-transparent group-hover:border-foreground transition-all duration-300">
									{image ? (
										<YNSImage src={image} alt={collection.name} fill sizes="96px" className="object-cover" />
									) : (
										<div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground text-2xl font-heading">
											{collection.name.charAt(0)}
										</div>
									)}
								</div>
								<span className="text-xs sm:text-sm font-medium text-foreground text-center leading-tight">
									{collection.name}
								</span>
							</YnsLink>
						);
					})}
				</div>
			</div>
		</section>
	);
}
