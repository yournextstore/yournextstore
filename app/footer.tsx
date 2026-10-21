import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { commerce, meGetCached } from "@/lib/commerce";

type FooterLink = { href: string; label: string };

// Footer links are the merchant's own pages; tools that are switched off drop out instead of
// rendering a dead link.
async function getFooterLinks(): Promise<FooterLink[]> {
	"use cache";
	cacheLife("hours");

	const [me, legal] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
	]);
	const tools = me?.store.settings?.enabledTools;

	return [
		{ href: "/about", label: "About" },
		{ href: "/faq", label: "FAQ" },
		...(tools?.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
		...(tools?.blog ? [{ href: "/blog", label: "Journal" }] : []),
		...legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
	];
}

// `new Date()` is an unstable value: now that the footer is part of the prerendered
// shell, reading it during the prerender is an error. Caching pins it to the entry.
async function getCopyrightYear() {
	"use cache";
	cacheLife("days");

	return new Date().getFullYear();
}

export async function Footer({ storeName }: { storeName: string }) {
	const [year, links] = await Promise.all([getCopyrightYear(), getFooterLinks()]);

	return (
		<footer className="border-t border-line">
			<div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-6 py-10 text-xs uppercase tracking-widest text-muted-foreground">
				<span>
					&copy; {year} {storeName}
				</span>
				<nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-3">
					{links.map((link) => (
						<Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
							{link.label}
						</Link>
					))}
				</nav>
				<div className="w-full sm:ml-auto sm:w-auto">
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
