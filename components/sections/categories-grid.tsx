import { cacheLife } from "next/cache";
import Image from "next/image";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";

const categoryImages: Record<string, string> = {
	0: "/scraped-2.png",
	1: "/scraped-3.png",
	2: "/scraped-4.png",
	3: "/scraped-5.png",
};

export async function CategoriesGrid() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 4 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<section className="py-16 sm:py-20">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<h2 className="font-heading text-center text-3xl font-bold tracking-tight sm:text-4xl">
					Shop By Categories
				</h2>
				<div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
					{collections.data.map((collection, index) => (
						<YnsLink
							prefetch={"eager"}
							key={collection.id}
							href={`/collection/${collection.slug}`}
							className="group relative aspect-[3/4] overflow-hidden rounded-sm"
						>
							<Image
								src={categoryImages[String(index)] ?? "/scraped-2.png"}
								alt={collection.name}
								fill
								sizes="(max-width: 640px) 50vw, 25vw"
								className="object-cover transition-transform duration-500 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
							<div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
								<h3 className="text-lg font-semibold text-white sm:text-xl">{collection.name}</h3>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
