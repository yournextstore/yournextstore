import Link from "next/link";
import { getCatalogCategories } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

/** "Our Categories": large photo tiles with the name on a taupe bar, two to a row (three when there are three). */
export async function HomeCategories() {
	const categories = (await getCatalogCategories()).filter((category) => category.image).slice(0, 4);
	if (categories.length === 0) return null;

	return (
		<section className="mx-auto mt-24 max-w-screen-2xl px-5 max-[400px]:px-3">
			<h2 className="mb-12 text-5xl tracking-[1.56px] max-sm:text-4xl">Our Categories</h2>
			<div
				className={cn(
					"grid grid-cols-1 gap-10",
					categories.length === 3
						? "sm:grid-cols-3 sm:gap-x-6 lg:gap-x-10"
						: categories.length > 1 && "sm:grid-cols-2 sm:gap-x-16 lg:gap-x-[12%]",
				)}
			>
				{categories.map((category) => (
					<Link key={category.slug} href={`/category/${category.slug}`} className="group relative block">
						<div className="relative aspect-[600/560] overflow-hidden bg-secondary">
							{category.image && (
								<YNSMedia
									src={category.image}
									alt=""
									fill
									sizes={
										categories.length === 3
											? "(max-width: 640px) 100vw, 33vw"
											: "(max-width: 640px) 100vw, 45vw"
									}
									className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
								/>
							)}
						</div>
						<div className="flex h-16 w-full items-center justify-center bg-taupe px-4 text-white max-sm:h-12">
							<h3 className="truncate text-2xl max-sm:text-xl">{category.name}</h3>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
}
