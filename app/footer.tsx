import { cacheLife } from "next/cache";
import Link from "next/link";
import { commerce, meGetCached } from "@/lib/commerce";
import { PAGE } from "@/lib/display";

type FooterLink = { href: string; label: string };

// `new Date()` is an unstable value: the footer is part of the prerendered shell, so the
// year (with every other footer read) is pinned to a cache entry.
async function getFooterData() {
	"use cache";
	cacheLife("hours");

	const [me, legal] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
	]);
	const tools = me?.store.settings?.enabledTools;
	const links: FooterLink[] = [
		{ href: "/about", label: "About" },
		{ href: "/faq", label: "FAQ" },
		...(tools?.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
		...(tools?.blog ? [{ href: "/blog", label: "Blog" }] : []),
		...legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
	];
	return {
		year: new Date().getFullYear(),
		storeName: me?.store.settings?.storeName || me?.store.name || "Your Next Store",
		links,
	};
}

/** The original's footer: one hairline, the copyright on the left, a few bold links on the right. */
export async function Footer() {
	const { year, storeName, links } = await getFooterData();

	return (
		<footer className={PAGE}>
			<div className="flex flex-col gap-4 border-t border-[#cbd5e0] py-8 sm:flex-row sm:items-center">
				<p className="text-xs text-ink-soft">
					Copyright © {year} {storeName}. All rights reserved.
				</p>
				<nav aria-label="Footer" className="sm:ml-auto">
					<ul className="flex flex-wrap gap-x-6 gap-y-2">
						{links.map((link) => (
							<li key={link.href}>
								<Link href={link.href} className="text-sm font-semibold text-foreground hover:underline">
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</div>
		</footer>
	);
}
