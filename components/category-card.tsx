import Link from "next/link";
import type { CatalogCategory } from "@/lib/catalog";
import { productCount, sentenceCase } from "@/lib/display";
import { YNSMedia } from "@/lib/yns-media";

/** The original's category card: a 4:3 photo over the name and a "N products" badge. */
export function CategoryCard({ category }: { category: CatalogCategory }) {
	return (
		<Link
			href={`/category/${category.slug}`}
			className="flex size-full flex-col gap-4 overflow-hidden rounded-md border bg-accent/20 text-card-foreground shadow-sm transition-all hover:bg-accent"
		>
			<div className="relative aspect-[4/3] border-b bg-secondary">
				{category.image ? (
					<YNSMedia
						src={category.image}
						alt=""
						fill
						sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
						className="object-cover object-[50%_30%]"
					/>
				) : null}
			</div>
			<div className="flex flex-1 flex-col gap-1.5 px-4 pb-4 sm:px-6 sm:pb-6">
				<h3 className="text-base leading-tight font-semibold tracking-tight [overflow-wrap:anywhere] sm:text-lg sm:leading-none">
					{sentenceCase(category.name)}
				</h3>
				<span className="pointer-events-none w-fit rounded bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
					{productCount(category.count)}
				</span>
			</div>
		</Link>
	);
}
