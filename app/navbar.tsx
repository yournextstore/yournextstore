import { ChevronDown } from "lucide-react";
import Link from "next/link";
import type { MenuCategory } from "@/lib/catalog";

const itemClass =
	"flex h-full items-center px-4 font-medium xl:px-5 text-neutral-700 transition-colors hover:bg-violet-soft hover:text-violet";

const discover = [
	{ label: "New arrivals", href: "/products" },
	{ label: "Price: low to high", href: "/products?sort=price-asc" },
	{ label: "Price: high to low", href: "/products?sort=price-desc" },
	{ label: "A–Z", href: "/products?sort=name" },
];

/**
 * Desktop navigation: a "Shop" item that opens the original's full-width mega menu (pure CSS:
 * hover, or keyboard focus inside), then the largest categories as plain links.
 */
export function DesktopNav({ categories }: { categories: MenuCategory[] }) {
	const featured = categories.slice(0, 3);
	const columns = categories.slice(0, 5);

	return (
		<nav aria-label="Main" className="mx-auto hidden h-full lg:block">
			<ul className="flex h-full">
				<li className="group/shop h-full">
					<Link href="/products" className={itemClass} aria-haspopup="true">
						Shop
						<ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover/shop:rotate-180" />
					</Link>
					<div className="invisible absolute inset-x-0 top-full border-t border-neutral-200 bg-card opacity-0 shadow-md shadow-neutral-300 transition-opacity duration-200 group-hover/shop:visible group-hover/shop:opacity-100 group-has-[:focus-visible]/shop:visible group-has-[:focus-visible]/shop:opacity-100">
						<div className="kara-container flex">
							<div className="w-1/4 shrink-0 py-8 pr-4">
								<Link
									href="/products"
									className="text-sm font-bold uppercase leading-4 tracking-widest text-neutral-800 hover:underline"
								>
									New &amp; trending
								</Link>
								<ul className="space-y-1.5 pt-3">
									{discover.map((item) => (
										<li key={item.href}>
											<Link href={item.href} className="text-xs text-neutral-700 hover:underline">
												{item.label}
											</Link>
										</li>
									))}
								</ul>
							</div>
							<div className="flex flex-1 gap-4 border-l border-neutral-200 pl-4">
								{columns.map((category) => (
									<div key={category.slug} className="w-full max-w-[11rem] py-8">
										<Link
											href={`/category/${category.slug}`}
											className="text-sm font-bold uppercase leading-5 tracking-widest text-neutral-800 hover:underline"
										>
											{category.name}
										</Link>
										<ul className="space-y-1.5 pt-3">
											{category.products.map((product) => (
												<li key={product.slug}>
													<Link
														href={`/product/${product.slug}`}
														className="line-clamp-1 text-xs text-neutral-700 hover:underline"
													>
														{product.name}
													</Link>
												</li>
											))}
										</ul>
									</div>
								))}
							</div>
						</div>
						<div className="border-t border-neutral-200">
							<div className="kara-container flex">
								<div className="w-1/4 shrink-0 py-3 pr-4">
									<Link href="/products" className="text-xs font-bold text-neutral-800 hover:underline">
										All products
									</Link>
								</div>
								<div className="flex flex-1 gap-4 pl-4">
									{columns.map((category) => (
										<Link
											key={category.slug}
											href={`/category/${category.slug}`}
											className="w-full max-w-[11rem] py-3 text-xs font-bold text-neutral-800 hover:underline"
										>
											All {category.name.toLocaleLowerCase()}
										</Link>
									))}
								</div>
							</div>
						</div>
					</div>
				</li>
				{featured.map((category, index) => (
					<li key={category.slug} className={index > 0 ? "hidden h-full xl:block" : "h-full"}>
						<Link href={`/category/${category.slug}`} className={`${itemClass} whitespace-nowrap`}>
							{category.name}
						</Link>
					</li>
				))}
				<li className="h-full">
					<Link href="/about" className={itemClass}>
						About
					</Link>
				</li>
			</ul>
		</nav>
	);
}
