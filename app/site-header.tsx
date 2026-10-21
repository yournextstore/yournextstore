import { ShieldCheckIcon, TruckIcon, UserRoundIcon } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { CartButton } from "@/app/cart-button";
import { CatalogMenu, MobileMenu, PagesMenu, SearchToggle } from "@/app/header-menus";
import { Logo } from "@/components/logo";
import { getCatalogEntries, getStoreInfo, type NavLink } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";

async function getPageLinks(): Promise<NavLink[]> {
	"use cache";
	cacheLife("hours");
	const [info, legal] = await Promise.all([
		getStoreInfo(),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
	]);
	return [
		{ href: "/about", label: "About" },
		{ href: "/faq", label: "FAQ" },
		...(info.contact ? [{ href: "/contact", label: "Contacts" }] : []),
		...(info.blog ? [{ href: "/blog", label: "Blog" }] : []),
		...legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
	];
}

const navLink =
	"flex h-[60px] items-center px-[15px] text-uk-sm uppercase text-muted-foreground transition-colors hover:text-foreground";

export async function SiteHeader({ accountHref }: { accountHref: string }) {
	const [info, entries, pages] = await Promise.all([getStoreInfo(), getCatalogEntries(), getPageLinks()]);

	return (
		<>
			{/* Toolbar (UIkit .tm-toolbar-container): dark strip, desktop only. */}
			<div className="hidden bg-ink text-uk-sm text-ink-muted lg:block">
				<div className="uk-container flex h-10 items-center justify-between">
					<ul className="flex items-center gap-[30px]">
						{info.freeShipping && (
							<li className="flex items-center gap-[5px]">
								<TruckIcon aria-hidden className="size-[15px]" strokeWidth={1.25} />
								<span>Free shipping on orders over {info.freeShipping}</span>
							</li>
						)}
						<li className="flex items-center gap-[5px]">
							<ShieldCheckIcon aria-hidden className="size-[15px]" strokeWidth={1.25} />
							<span>Secure checkout</span>
						</li>
					</ul>
					<nav aria-label="Service">
						<ul className="flex items-center gap-[30px]">
							<li>
								<Link href="/faq" className="transition-colors hover:text-white">
									FAQ
								</Link>
							</li>
							<li>
								<Link href="/about" className="transition-colors hover:text-white">
									About
								</Link>
							</li>
							<li>
								{/* Plain <a>: /account is a proxied zone. */}
								<a href={accountHref} className="transition-colors hover:text-white">
									Order status
								</a>
							</li>
						</ul>
					</nav>
				</div>
			</div>

			{/* Navbar (UIkit .tm-navbar-container): white, 60px, sticky. */}
			<header className="site-header sticky top-0 z-40 border-b border-border bg-card">
				<div className="uk-container relative flex h-[60px] items-center justify-between">
					<div className="flex min-w-0 items-center">
						<MobileMenu
							storeName={info.storeName}
							entries={entries}
							pages={pages}
							accountHref={accountHref}
							freeShipping={info.freeShipping}
							socials={info.socialLinks}
						/>
						<Link
							href="/"
							className="mr-[15px] flex min-w-0 items-center"
							aria-label={`${info.storeName} home`}
						>
							<Logo name={info.storeName} />
						</Link>
						<nav aria-label="Main" className="hidden lg:block">
							<ul className="flex items-center">
								<li>
									<CatalogMenu entries={entries} />
								</li>
								<li>
									<Link href="/products" className={navLink}>
										Products
									</Link>
								</li>
								<li>
									<PagesMenu pages={pages} />
								</li>
								<li>
									<Link href="/about" className={navLink}>
										About
									</Link>
								</li>
								<li>
									<Link href="/faq" className={navLink}>
										FAQ
									</Link>
								</li>
							</ul>
						</nav>
					</div>
					<div className="flex items-center">
						<SearchToggle />
						<a
							href={accountHref}
							aria-label="Account"
							className="flex h-[60px] w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground lg:w-[50px]"
						>
							<UserRoundIcon aria-hidden className="size-5" strokeWidth={1.25} />
						</a>
						<CartButton />
					</div>
				</div>
			</header>
		</>
	);
}
