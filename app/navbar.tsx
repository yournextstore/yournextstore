import { cacheLife } from "next/cache";
import Link from "next/link";
import { NavbarMenu, type NavLink } from "@/app/navbar-menu";
import { commerce, meGetCached } from "@/lib/commerce";

// The links are the same for every visitor, so the whole navbar is one cached read. The mobile menu
// (a client sheet) gets the same list as the desktop row.
export async function Navbar() {
	"use cache";
	cacheLife("hours");

	const [collections, me] = await Promise.all([
		commerce.collectionBrowse({ active: true, limit: 5 }),
		meGetCached().catch(() => null),
	]);
	const blogEnabled = me?.store.settings?.enabledTools?.blog ?? false;
	const links: NavLink[] = [
		{ href: "/", label: "Home" },
		{ href: "/products", label: "Products" },
		...collections.data.map((collection) => ({
			href: `/collection/${collection.slug}`,
			label: collection.name,
		})),
		...(blogEnabled ? [{ href: "/blog", label: "Blog" }] : []),
	];

	return (
		<>
			<NavbarMenu links={links} />
			<nav className="hidden sm:flex items-center gap-8">
				{links.map((link) => (
					<Link
						key={link.href}
						href={link.href}
						className="text-[13px] font-medium tracking-wide uppercase text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
					>
						{link.label}
					</Link>
				))}
			</nav>
		</>
	);
}
