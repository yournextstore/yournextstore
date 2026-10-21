import Link from "next/link";
import { getCategoryCards } from "@/lib/catalog";
import { YNSMedia } from "@/lib/yns-media";

export async function CategoryGrid() {
	const categories = await getCategoryCards();
	if (categories.length === 0) return null;

	return (
		<section aria-labelledby="shop-by-category" className="mx-auto max-w-[82rem] px-4 pt-12 sm:pt-16">
			<h2 id="shop-by-category" className="mb-8 text-center text-2xl tracking-tight uppercase">
				Shop by category
			</h2>
			<div
				className={`grid items-stretch gap-2 sm:grid-cols-3 lg:gap-4 ${categories.length === 3 ? "grid-cols-3" : "grid-cols-2"} ${categories.length % 3 === 0 && categories.length <= 6 ? "" : "lg:grid-cols-4"}`}
			>
				{categories.map((category) => (
					<Link
						key={category.id}
						href={`/category/${category.slug}`}
						className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-card p-2 shadow-sm transition-shadow duration-300 hover:shadow-md sm:rounded-3xl lg:p-3 dark:border-neutral-800"
					>
						<div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900">
							{category.image ? (
								<YNSMedia
									src={category.image}
									alt=""
									fill
									sizes="(max-width: 640px) 48vw, (max-width: 1024px) 32vw, 24vw"
									className="object-cover transition duration-300 ease-in-out group-hover:scale-105"
								/>
							) : null}
						</div>
						<div className="flex min-w-0 flex-1 flex-col gap-0.5 px-1 pt-3 pb-2 min-[480px]:flex-row min-[480px]:items-baseline min-[480px]:justify-between min-[480px]:gap-2 sm:pt-4">
							<span className="line-clamp-2 text-[13px] font-semibold break-words min-[400px]:text-sm text-neutral-900 sm:text-base dark:text-neutral-100">
								{category.name}
							</span>
							<span className="shrink-0 text-xs text-muted-foreground">{category.count}</span>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
}
