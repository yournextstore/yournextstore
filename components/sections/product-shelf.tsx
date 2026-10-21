import Link from "next/link";
import { ShelfCard } from "@/components/product-card";
import { getShelfProducts } from "@/lib/catalog";

function SeeEverything({ href, className }: { href: string; className?: string }) {
	return (
		<Link
			href={href}
			className={`text-sm font-semibold text-brand hover:text-brand-hover ${className ?? ""}`}
		>
			See everything<span aria-hidden="true"> &rarr;</span>
		</Link>
	);
}

/** Penny's "collection" row: a sideways rail on phones, four columns from lg. */
export async function ProductShelf({
	title,
	href,
	categorySlug,
}: {
	title: string;
	href: string;
	categorySlug: string | null;
}) {
	const products = await getShelfProducts(categorySlug, 4);
	if (products.length === 0) return null;

	return (
		<section aria-labelledby="shelf-heading" className="bg-white">
			<div className="py-16 sm:py-24 lg:mx-auto lg:max-w-7xl lg:px-8 lg:py-32">
				<div className="flex items-center justify-between px-4 sm:px-6 lg:px-0">
					<h2 id="shelf-heading" className="text-2xl font-extrabold tracking-tight text-gray-900">
						{title}
					</h2>
					<SeeEverything href={href} className="hidden sm:block" />
				</div>
				<div className="relative mt-8">
					<div className="relative w-full overflow-x-auto">
						<ul className="mx-4 inline-flex space-x-8 sm:mx-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-x-8 lg:space-x-0">
							{products.map((product) => (
								<li key={product.id} className="inline-flex w-64 flex-col lg:w-auto">
									<ShelfCard product={product} />
								</li>
							))}
						</ul>
					</div>
				</div>
				<div className="mt-12 px-4 sm:hidden">
					<SeeEverything href={href} />
				</div>
			</div>
		</section>
	);
}
