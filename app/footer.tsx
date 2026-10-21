import { cacheLife } from "next/cache";
import Link from "next/link";
import { LeafGlyph } from "@/components/garden/icons";
import { PaymentMethods } from "@/components/payment-methods";
import { commerce, meGetCached } from "@/lib/commerce";
import { getLinkableCollections, getStoreBrand } from "@/lib/garden";

async function getFooterLinks() {
	"use cache";
	cacheLife("hours");

	const [me, collections, legal] = await Promise.all([
		meGetCached().catch(() => null),
		getLinkableCollections(2),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
	]);
	const tools = me?.store.settings?.enabledTools;
	return {
		main: [
			{ href: "/", label: "Home" },
			{ href: "/products", label: "Shop" },
			...collections.map((c) => ({ href: `/collection/${c.slug}`, label: c.name })),
			{ href: "/about", label: "About" },
			{ href: "/faq", label: "FAQ" },
			...(tools?.blog ? [{ href: "/blog", label: "Journal" }] : []),
			...(tools?.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
		],
		legal: legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
	};
}

// `new Date()` is an unstable value: now that the footer is part of the prerendered
// shell, reading it during the prerender is an error. Caching pins it to the entry.
async function getCopyrightYear() {
	"use cache";
	cacheLife("days");

	return new Date().getFullYear();
}

export async function Footer() {
	const [year, brand, links] = await Promise.all([getCopyrightYear(), getStoreBrand(), getFooterLinks()]);

	return (
		<footer className="site-footer">
			<div className="wrap">
				<div className="footer__row">
					<Link href="/" className="brand">
						<span className="brand__mark" aria-hidden="true">
							{brand.initial}
						</span>
						<span className="brand__text">
							<span className="brand__name">{brand.name}</span>
							<span className="brand__tag">{brand.tagline}</span>
						</span>
					</Link>
					<nav className="footer__nav" aria-label="Footer">
						<ul>
							{links.main.map((link) => (
								<li key={link.href}>
									<Link href={link.href}>{link.label}</Link>
								</li>
							))}
						</ul>
					</nav>
				</div>

				<div className="footer__bottom">
					<div className="flex flex-col gap-2 max-md:items-center">
						<p>
							&copy; {year} {brand.name}. All rights reserved.
						</p>
						{links.legal.length > 0 && (
							<ul className="flex flex-wrap gap-x-4 gap-y-1 max-md:justify-center">
								{links.legal.map((link) => (
									<li key={link.href}>
										<Link href={link.href} className="underline-offset-4 hover:underline">
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						)}
					</div>
					<PaymentMethods />
					<p className="footer__hand">
						Small things. Big stories.
						<LeafGlyph width={20} height={20} />
					</p>
				</div>
			</div>
		</footer>
	);
}
