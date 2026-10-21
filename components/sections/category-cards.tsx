import Link from "next/link";
import type { CatalogCategory } from "@/lib/catalog";
import { pieces } from "@/lib/display";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

/** CardCategory: a photo card with the kicker, name and "See products >" set white at its foot. */
export function CategoryCard({ category }: { category: CatalogCategory }) {
	return (
		<Link
			href={`/category/${category.slug}`}
			className="group relative isolate flex aspect-[7/10] items-end overflow-hidden rounded-xl bg-slate-ink shadow-lg"
		>
			{category.image && (
				<YNSMedia
					src={category.image}
					alt=""
					fill
					sizes="(max-width: 768px) 100vw, (max-width: 992px) 50vw, 25vw"
					className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105"
				/>
			)}
			<span
				aria-hidden
				className="absolute inset-0 -z-10 bg-linear-to-t from-black/75 via-black/15 to-transparent"
			/>
			<span className="block w-full px-4 pb-5 text-center">
				<span className="mb-1 block text-sm font-semibold text-white">{pieces(category.count)}</span>
				<span className="block text-xl font-bold leading-tight text-white">{category.name}</span>
				<span className="mt-2 block text-sm font-medium text-white">See products &gt;</span>
			</span>
		</Link>
	);
}

export function CategoryCards({ categories }: { categories: CatalogCategory[] }) {
	if (categories.length === 0) return null;
	// Three categories fill one row of three; otherwise two or four columns (never a lone gap).
	const shown = categories.length === 3 ? categories : categories.slice(0, categories.length >= 4 ? 4 : 2);
	return (
		<section className="container-ae py-16 sm:py-20">
			<div className="mb-10 text-center">
				<h2 className="text-[1.75rem] font-bold sm:text-[1.875rem]">Shop by category</h2>
				<Link
					href="/products"
					className="mt-1 inline-block text-sm font-semibold text-slate-ink hover:underline"
				>
					Browse all products &gt;
				</Link>
			</div>
			<div
				className={cn(
					"grid grid-cols-1 gap-6 sm:grid-cols-2",
					shown.length === 3 ? "sm:grid-cols-3" : "lg:grid-cols-4",
				)}
			>
				{shown.map((category) => (
					<CategoryCard key={category.slug} category={category} />
				))}
			</div>
		</section>
	);
}
