import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { getMenuCategories } from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";

type FooterLink = { href: string; label: string };

async function getFooterData() {
	"use cache";
	cacheLife("hours");

	const [me, categories, legal] = await Promise.all([
		meGetCached().catch(() => null),
		getMenuCategories().catch(() => []),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
	]);
	const tools = me?.store.settings?.enabledTools;
	const company: FooterLink[] = [
		{ href: "/about", label: "About" },
		...(tools?.blog ? [{ href: "/blog", label: "Journal" }] : []),
		{ href: "/faq", label: "FAQ" },
		...(tools?.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
	];

	return {
		storeName: me?.store.name || "Your Next Store",
		year: new Date().getFullYear(),
		menu: [
			{ href: "/products", label: "Shop all" },
			...categories.map((category) => ({ href: `/category/${category.path}`, label: category.name })),
		],
		company,
		legal: legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
	};
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
	if (links.length === 0) {
		return null;
	}
	const id = `footer-${title.toLowerCase()}`;
	return (
		<section aria-labelledby={id} className="flex min-w-0 flex-col items-start gap-2">
			<h2 id={id} className="mb-1 text-label-sm font-semibold uppercase">
				{title}
			</h2>
			{links.map((link) => (
				<Link key={link.href} href={link.href} className="text-body-sm leading-normal hover:underline">
					{link.label}
				</Link>
			))}
		</section>
	);
}

/** The original's long-form footer: label-cased columns, an oversized uppercase wordmark, the year. */
export async function Footer() {
	const { storeName, year, menu, company, legal } = await getFooterData();

	return (
		<footer className="border-t border-[#e5ddd1] bg-background text-foreground">
			<div className="shell flex flex-col gap-8 py-12 lg:py-16">
				<div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-[repeat(3,minmax(0,220px))] lg:gap-12">
					<FooterColumn title="Shop" links={menu} />
					<FooterColumn title="Company" links={company} />
					<FooterColumn title="Legal" links={legal} />
				</div>
				<p className="text-display-sm font-semibold uppercase leading-normal [overflow-wrap:anywhere] lg:text-display-lg lg:leading-none">
					{storeName}
				</p>
				<div className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-label-sm">
						&copy; {year} {storeName}
					</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
