import Link from "next/link";
import { Fragment } from "react";
import { CartButton } from "@/app/cart-button";
import { Wordmark } from "@/components/wordmark";

export type NavLink = {
	href: string;
	label: string;
	/** Proxied zones (/account) need a full navigation, never a soft one. */
	external?: boolean;
};

/**
 * The original's header: one comma-separated line of text links ending in the bag count,
 * over the store name set as a column-wide logotype. It wraps instead of collapsing into a
 * menu, as the original does at every width.
 */
export function SiteHeader({ storeName, links }: { storeName: string; links: NavLink[] }) {
	return (
		<header className="site-header relative z-10 md:w-[calc((100%-2.5rem)/2)]">
			<nav aria-label="Main" className="flex flex-wrap items-center py-3 lg:py-5">
				{links.map((link) => (
					<Fragment key={link.href}>
						{link.external ? (
							<a href={link.href} className="inline-flex min-h-6 items-center hover:italic">
								{link.label}
							</a>
						) : (
							<Link href={link.href} className="inline-flex min-h-6 items-center hover:italic">
								{link.label}
							</Link>
						)}
						<span aria-hidden="true" className="pr-1">
							,
						</span>
					</Fragment>
				))}
				<CartButton />
			</nav>
			<Link href="/" aria-label={`${storeName} home`} className="block">
				<Wordmark name={storeName} />
			</Link>
		</header>
	);
}
