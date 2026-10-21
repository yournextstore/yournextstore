"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ChevronDown, Home, LayoutGrid, Search, ShoppingBag, UserRound, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/app/cart/cart-context";
import type { MenuCategory } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const tabClass =
	"flex h-full w-full flex-col items-center justify-center gap-1 text-xs font-medium text-neutral-700 transition-colors hover:text-violet";

// Reading the path in an effect keeps the bar in the prerendered shell (usePathname would need Suspense).
function useCurrentPath() {
	const [path, setPath] = useState<string | null>(null);
	useEffect(() => {
		const read = () => setPath(window.location.pathname);
		read();
		const nav = (window as Window & { navigation?: EventTarget }).navigation;
		nav?.addEventListener("navigatesuccess", read);
		window.addEventListener("popstate", read);
		return () => {
			nav?.removeEventListener("navigatesuccess", read);
			window.removeEventListener("popstate", read);
		};
	}, []);
	return path;
}

/** The original's phone tab bar (Home · Collections · Cart · …) and its full-screen collections page. */
export function BottomNav({ categories, accountHref }: { categories: MenuCategory[]; accountHref: string }) {
	const { itemCount, openCart } = useCart();
	const [shopOpen, setShopOpen] = useState(false);
	const path = useCurrentPath();
	const close = () => setShopOpen(false);

	return (
		<>
			<nav
				aria-label="Shortcuts"
				className="fixed inset-x-0 bottom-0 z-50 h-16 bg-card drop-shadow-[0_-15px_20px_rgba(0,0,0,0.10)] lg:hidden"
			>
				<ul className="flex h-full">
					<li className="flex-1">
						<Link href="/" className={cn(tabClass, path === "/" && "text-violet")}>
							<Home className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
							Home
						</Link>
					</li>
					<li className="flex-1">
						<button
							type="button"
							onClick={() => setShopOpen(true)}
							className={cn(tabClass, shopOpen && "text-violet")}
						>
							<LayoutGrid className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
							Shop
						</button>
					</li>
					<li className="flex-1">
						<button
							type="button"
							onClick={openCart}
							className={tabClass}
							aria-label={itemCount > 0 ? `Cart ${itemCount} items` : "Cart"}
						>
							<span className="relative">
								<ShoppingBag className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
								{itemCount > 0 && (
									<span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet px-1 text-[10px] font-semibold text-white">
										{itemCount}
									</span>
								)}
							</span>
							Cart
						</button>
					</li>
					<li className="flex-1">
						<Link href="/search" className={cn(tabClass, path === "/search" && "text-violet")}>
							<Search className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
							Search
						</Link>
					</li>
					<li className="flex-1">
						{/* Plain <a>: /account is a proxied zone. */}
						<a href={accountHref} className={tabClass}>
							<UserRound className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
							Profile
						</a>
					</li>
				</ul>
			</nav>

			<Dialog.Root open={shopOpen} onOpenChange={setShopOpen}>
				<Dialog.Portal>
					<Dialog.Content className="fixed inset-0 z-[60] overflow-y-auto bg-card px-5 pb-24 pt-5 lg:hidden">
						<div className="flex items-center justify-between">
							<Dialog.Title className="text-xl font-medium">Shop</Dialog.Title>
							<Dialog.Close className="p-1" aria-label="Close">
								<X className="h-6 w-6" />
							</Dialog.Close>
						</div>
						<Dialog.Description className="sr-only">Browse the shop by category</Dialog.Description>
						<ul className="mt-5 flex flex-col px-2 font-medium text-neutral-800">
							<li className="border-b border-neutral-100">
								<Link href="/products" onClick={close} className="block py-4">
									All products
								</Link>
							</li>
							{categories.map((category) => (
								<li key={category.slug} className="border-b border-neutral-100">
									<details className="group">
										<summary className="flex cursor-pointer list-none items-center justify-between py-4 [&::-webkit-details-marker]:hidden">
											{category.name}
											<ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
										</summary>
										<ul className="px-2 pb-2 text-sm">
											{category.products.map((product) => (
												<li key={product.slug} className="border-b border-neutral-100">
													<Link href={`/product/${product.slug}`} onClick={close} className="block py-2.5">
														{product.name}
													</Link>
												</li>
											))}
											<li>
												<Link
													href={`/category/${category.slug}`}
													onClick={close}
													className="block py-2.5 font-semibold text-violet"
												>
													All {category.name.toLocaleLowerCase()} ({category.count})
												</Link>
											</li>
										</ul>
									</details>
								</li>
							))}
							<li className="border-b border-neutral-100">
								<Link href="/about" onClick={close} className="block py-4">
									About
								</Link>
							</li>
							<li className="border-b border-neutral-100">
								<Link href="/faq" onClick={close} className="block py-4">
									Help
								</Link>
							</li>
						</ul>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</>
	);
}
