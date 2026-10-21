import { cacheLife } from "next/cache";
import Link from "next/link";
import { Fragment } from "react";
import { PaymentMethods } from "@/components/payment-methods";
import { Wordmark } from "@/components/wordmark";
import { commerce, meGetCached } from "@/lib/commerce";

type FooterLink = { href: string; label: string };

// Cached so the footer stays in the prerendered shell; `new Date()` is pinned to the entry.
async function getFooterData() {
	"use cache";
	cacheLife("hours");

	const [me, legal] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
	]);
	const tools = me?.store.settings?.enabledTools;
	const links: FooterLink[] = [
		{ href: "/products", label: "Shop" },
		{ href: "/about", label: "About" },
		...(tools?.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
		{ href: "/search", label: "Search" },
		{ href: "/faq", label: "FAQ" },
		...(tools?.blog ? [{ href: "/blog", label: "Journal" }] : []),
		...legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
	];

	return {
		storeName: me?.store.name || "Your Next Store",
		tagline: me?.store.settings?.storeDescription || null,
		links,
		year: new Date().getFullYear(),
	};
}

/**
 * The original's footer: a small logotype, a quiet centre line, and on the right a
 * comma-separated row of links ending in the copyright, over an italic serif tagline.
 */
export async function Footer() {
	const { storeName, tagline, links, year } = await getFooterData();

	return (
		<footer className="py-6 lg:py-12">
			<div className="shell space-y-6 md:flex md:items-center md:space-y-0 md:px-4 lg:px-5">
				<div className="w-full md:w-1/3">
					<Link href="/" aria-label={`${storeName} home`} className="block w-full max-w-44">
						<Wordmark name={storeName} />
					</Link>
				</div>

				<div className="flex w-full items-center md:w-1/3 md:justify-center">
					<PaymentMethods />
				</div>

				<div className="w-full md:w-1/3 md:text-right">
					<p>
						{links.map((link) => (
							<Fragment key={link.href}>
								<Link href={link.href} className="hover:italic">
									{link.label}
								</Link>
								,{" "}
							</Fragment>
						))}
						<span>&copy; {year}</span>
					</p>
					{tagline && <p className="font-serif italic">{tagline}</p>}
				</div>
			</div>
		</footer>
	);
}
