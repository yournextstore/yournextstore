import { PackageSearchIcon, UserIcon } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import { CartButton } from "@/app/cart-button";
import { type DepartmentLink, DepartmentsMenu, MobileMenu, type NavLink } from "@/app/navbar";
import { Logo } from "@/components/logo";
import { SearchInput } from "@/components/search/search-input";
import { getCategoryTiles, getCollectionTiles, getStoreBrand } from "@/lib/catalog";

async function getHeaderData() {
	"use cache";
	cacheLife("hours");
	const [brand, categories, collections] = await Promise.all([
		getStoreBrand(),
		getCategoryTiles(),
		getCollectionTiles(),
	]);
	// Parents first, each followed by its sub-categories.
	const parents = categories.filter((c) => !c.parentId || !categories.some((p) => p.id === c.parentId));
	const departments: DepartmentLink[] = parents.flatMap((parent) => [
		{ href: parent.href, label: parent.name, child: false },
		...categories
			.filter((c) => c.parentId === parent.id)
			.map((c) => ({ href: c.href, label: c.name, child: true })),
	]);
	const links: NavLink[] = [
		{ href: "/", label: "Home" },
		{ href: "/products", label: "Shop" },
		...collections.slice(0, 3).map((c) => ({ href: c.href, label: c.name })),
		{ href: "/about", label: "About" },
		...(brand.blog ? [{ href: "/blog", label: "Blog" }] : []),
	];
	return { brand, departments, links };
}

/**
 * FreshCart's three-tier header: the grey deals strip, the logo · search · icons row, and the
 * green "All Departments" button with the page links (below lg the links move into the offcanvas).
 */
export async function Header({ accountHref }: { accountHref: string }) {
	const { brand, departments, links } = await getHeaderData();

	return (
		<header className="border-b border-gray-300">
			<div className="bg-gray-100 py-1">
				<div className="fc-container flex flex-wrap">
					<p className="w-full text-center md:w-1/2 md:text-left">
						{brand.freeShippingLabel
							? `Free delivery on orders over ${brand.freeShippingLabel}`
							: "Super value deals – save more with discount codes"}
					</p>
					<div className="hidden w-1/2 justify-end gap-5 lg:flex">
						<Link href="/about" className="text-gray-800 transition hover:text-green-600">
							About us
						</Link>
						<Link href="/faq" className="text-gray-800 transition hover:text-green-600">
							Help
						</Link>
					</div>
				</div>
			</div>
			<div className="pt-5 pb-4 lg:pb-0">
				<div className="fc-container flex w-full items-center justify-between gap-4 lg:gap-0">
					<div className="min-w-0 lg:w-1/4 lg:shrink-0 lg:pr-4 xl:w-1/5">
						<Logo name={brand.name} className="lg:text-[1.5rem]" />
					</div>
					<div className="hidden lg:block lg:w-2/5">
						<Suspense
							fallback={<div className="h-[42px] w-full rounded-lg border border-gray-300 bg-white" />}
						>
							<SearchInput />
						</Suspense>
					</div>
					{/* Where the original has its "Location" picker: the shopper's orders, in the account zone. */}
					<div className="hidden xl:block xl:w-1/5 xl:pl-4">
						<a href={accountHref} className="fc-btn fc-btn-outline text-gray-600">
							<PackageSearchIcon className="size-4" aria-hidden />
							My orders
						</a>
					</div>
					<div className="flex shrink-0 items-center justify-end gap-5 min-[360px]:gap-7 lg:w-1/5">
						{/* Plain <a>: /account is a proxied zone — soft navigation 500s (see AGENTS.md). */}
						<a
							href={accountHref}
							className="inline-flex text-gray-600 transition hover:text-green-600"
							aria-label="Account"
						>
							<UserIcon className="size-[22px]" strokeWidth={1.75} />
						</a>
						<CartButton />
						<MobileMenu links={links} departments={departments} storeName={brand.name} />
					</div>
				</div>
			</div>
			<nav aria-label="Main" className="hidden lg:block">
				<div className="fc-container flex items-center py-3">
					<DepartmentsMenu departments={departments} />
					<ul className="flex items-center gap-3">
						{links.map((link) => (
							<li key={link.href}>
								<Link
									href={link.href}
									className="block px-3 py-2 leading-[1.8] font-medium whitespace-nowrap text-gray-800 transition hover:text-green-600"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</div>
			</nav>
		</header>
	);
}
