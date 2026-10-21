import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { Wordmark } from "@/components/wordmark";
import { commerce, meGetCached } from "@/lib/commerce";

const footerLink = "underline underline-offset-2 hover:text-foreground";

async function FooterLinks() {
	"use cache";
	cacheLife("hours");

	const [me, pages] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
	]);
	const tools = me?.store.settings?.enabledTools;
	const links = [
		{ href: "/about", label: "About" },
		{ href: "/faq", label: "FAQ" },
		...(tools?.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
		...(tools?.blog ? [{ href: "/blog", label: "Blog" }] : []),
		...pages.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
	];

	return (
		<ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 md:justify-start">
			{links.map((link) => (
				<li key={link.href}>
					<Link href={link.href} className={footerLink}>
						{link.label}
					</Link>
				</li>
			))}
		</ul>
	);
}

async function getStoreName() {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached().catch(() => null);
	return me?.store.name || "Your Next Store";
}

// `new Date()` is an unstable value: now that the footer is part of the prerendered
// shell, reading it during the prerender is an error. Caching pins it to the entry.
async function getCopyrightYear() {
	"use cache";
	cacheLife("days");

	return new Date().getFullYear();
}

export async function Footer() {
	const [year, storeName] = await Promise.all([getCopyrightYear(), getStoreName()]);

	// The original's three-part footer on #f0f0f0: links left, mark and year centred, payments right.
	return (
		<footer className="mt-12 bg-footer px-4 pt-6 pb-4 text-sal-sm text-paragraph flex flex-col text-center md:flex-row md:items-center md:justify-between md:text-left md:px-14 md:py-0">
			<div className="py-3 md:basis-2/5">
				<FooterLinks />
			</div>
			<div className="order-3 flex flex-col items-center py-3 md:order-none md:basis-1/5 md:py-[30px]">
				<Link href="/">
					<Wordmark name={storeName} />
				</Link>
				<p className="mt-4 text-sal-sm font-bold text-foreground">
					&copy;&nbsp;{year} {storeName}
				</p>
			</div>
			<div className="flex justify-center py-3 md:basis-2/5 md:justify-end">
				<PaymentMethods />
			</div>
		</footer>
	);
}
