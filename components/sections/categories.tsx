import Link from "next/link";
import { capitalize, getCatalogCategories } from "@/lib/catalog";
import { YNSMedia } from "@/lib/yns-media";

/** Penny's "Collections" band on gray-100; a YNS store's top categories fill its three tiles. */
export async function CategoryTiles() {
	const categories = (await getCatalogCategories()).filter((category) => category.image).slice(0, 3);
	if (categories.length === 0) return null;

	return (
		<section id="collections" aria-labelledby="collections-heading" className="scroll-mt-4 bg-gray-100">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
					<h2 id="collections-heading" className="text-2xl font-extrabold text-gray-900">
						Shop by category
					</h2>
					<div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
						{categories.map((category) => (
							<div key={category.slug} className="group relative">
								<div className="relative h-80 w-full overflow-hidden rounded-lg bg-white group-hover:opacity-75 sm:aspect-[2/1] sm:h-auto lg:aspect-square">
									{category.image && (
										<YNSMedia
											src={category.image}
											alt=""
											fill
											sizes="(min-width: 1024px) 400px, 100vw"
											className="object-cover object-[center_30%]"
										/>
									)}
								</div>
								<h3 className="mt-6 text-sm text-gray-500">
									<Link href={`/category/${category.slug}`}>
										<span className="absolute inset-0" />
										{capitalize(category.name)}
									</Link>
								</h3>
								<p className="text-base font-semibold text-gray-900">
									{category.count} {category.count === 1 ? "product" : "products"} to explore
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
