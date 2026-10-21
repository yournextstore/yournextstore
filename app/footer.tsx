import { cacheLife } from "next/cache";
import Link from "next/link";
import { FooterNewsletter } from "@/components/sections/newsletter";
import { getStoreIdentity, getTopCategories } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";

type FooterLink = { href: string; label: string; external?: boolean };

async function getFooterLinks(): Promise<FooterLink[]> {
	"use cache";
	cacheLife("hours");
	const [categories, identity, legal] = await Promise.all([
		getTopCategories(),
		getStoreIdentity(),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
	]);
	return [
		...categories,
		{ href: "/about", label: "About" },
		{ href: "/faq", label: "FAQ" },
		...(identity.contactFormEnabled ? [{ href: "/contact", label: "Contact" }] : []),
		...(identity.blogEnabled ? [{ href: "/blog", label: "Journal" }] : []),
		...legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
	];
}

// `new Date()` is an unstable value during the prerender; caching pins it to the entry.
async function getCopyrightYear() {
	"use cache";
	cacheLife("days");
	return new Date().getFullYear();
}

export async function Footer() {
	const [year, links, identity] = await Promise.all([
		getCopyrightYear(),
		getFooterLinks(),
		getStoreIdentity(),
	]);

	return (
		<footer className="flex flex-col gap-y-2 bg-black p-[var(--main-padding)] text-white md:flex-row md:items-start md:justify-between md:gap-x-6">
			<p className="shrink-0">
				&copy; {year} <Link href="/">{identity.storeName}</Link>
			</p>
			<ul className="flex flex-col gap-y-1 min-[481px]:flex-row min-[481px]:flex-wrap min-[481px]:gap-x-[var(--main-gap)]">
				{links.map((link) => (
					<li key={link.href}>
						<Link href={link.href} className="inline-flex min-h-6 items-center">
							{link.label}
						</Link>
					</li>
				))}
				<li className="sm:hidden">
					<Link href="/search" className="inline-flex min-h-6 items-center">
						Search
					</Link>
				</li>
				<li className="sm:hidden">
					<a href="/account" className="inline-flex min-h-6 items-center">
						Account
					</a>
				</li>
			</ul>
			<FooterNewsletter />
		</footer>
	);
}
