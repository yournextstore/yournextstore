import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { getStoreName } from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";

type FooterLink = { href: string; label: string };

// One cached read for the whole footer; `new Date()` is pinned to the cache entry too,
// since reading it during the prerender is an error.
async function getFooterData() {
	"use cache";
	cacheLife("hours");

	const [me, storeName, legal] = await Promise.all([
		meGetCached().catch(() => null),
		getStoreName(),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
	]);
	const tools = me?.store.settings?.enabledTools;
	const links: FooterLink[] = [
		{ href: "/products", label: "Shop all" },
		{ href: "/about", label: "About" },
		{ href: "/faq", label: "FAQ" },
		...(tools?.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
		...(tools?.blog ? [{ href: "/blog", label: "Journal" }] : []),
	];

	return {
		storeName,
		description: me?.store.settings?.storeDescription || null,
		links,
		legal: legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
		year: new Date().getFullYear(),
	};
}

// The original's footer: a hairline, a lowercase "about us", the house's two sentences and a
// small print line. Shop links and legal pages join it as plain text links.
export async function Footer() {
	const { storeName, description, links, legal, year } = await getFooterData();

	return (
		<footer className="mt-auto w-full border-t border-border py-10 lg:py-16">
			<div className="page-container text-body">
				<p className="mb-8">about us</p>
				<p className="max-w-2xl">
					{description ??
						`${storeName} brings together pieces chosen for how they are made and how long they last.`}
				</p>
				<nav aria-label="Footer" className="mt-8">
					<ul className="flex flex-wrap gap-x-6 gap-y-2">
						{links.map((link) => (
							<li key={link.href}>
								<Link href={link.href} className="underline-offset-4 hover:text-primary hover:underline">
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</nav>
				<div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="text-caption">
						<p>
							&copy; {year} {storeName}
						</p>
						{legal.length > 0 && (
							<ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
								{legal.map((page) => (
									<li key={page.href}>
										<Link
											href={page.href}
											className="font-semibold underline-offset-4 hover:text-primary hover:underline"
										>
											{page.label}
										</Link>
									</li>
								))}
							</ul>
						)}
					</div>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
