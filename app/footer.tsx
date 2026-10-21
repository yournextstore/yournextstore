import { cacheLife } from "next/cache";
import Link from "next/link";
import { FooterNewsletter } from "@/components/footer-newsletter";
import { PaymentMethods } from "@/components/payment-methods";
import { getCatalogCategories, getStoreIdentity } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";
import { sentenceCase } from "@/lib/display";

type FooterLink = { href: string; label: string; plain?: boolean };

async function getFooterColumns(): Promise<FooterLink[][]> {
	"use cache";
	cacheLife("hours");
	const [categories, identity, legal] = await Promise.all([
		getCatalogCategories(),
		getStoreIdentity(),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
	]);
	const shop = [
		...categories.slice(0, 3).map((category) => ({
			href: `/category/${category.slug}`,
			label: sentenceCase(category.name),
		})),
		{ href: "/products", label: "All products" },
	];
	const about = [
		{ href: "/about", label: "About us" },
		{ href: "/faq", label: "Frequently asked questions" },
		...(identity.contactFormEnabled ? [{ href: "/contact", label: "Contact" }] : []),
		...(identity.blogEnabled ? [{ href: "/blog", label: "Journal" }] : []),
	];
	const other = [
		...legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
		// /account is a proxied zone: a plain <a>, never <Link>.
		{ href: "/account", label: "Your account", plain: true },
		{ href: "/search", label: "Search" },
	];
	return [shop, about, other];
}

async function getFooterMeta() {
	"use cache";
	cacheLife("days");
	const identity = await getStoreIdentity();
	return { year: new Date().getFullYear(), storeName: identity.storeName };
}

const linkClass =
	"text-xs text-foreground/80 underline-offset-8 transition-all hover:underline hover:opacity-70 lg:text-sm";

export async function Footer() {
	const [columns, { year, storeName }] = await Promise.all([getFooterColumns(), getFooterMeta()]);

	return (
		<footer className="grid gap-8 border-t bg-accent/40 pt-16 pb-8">
			<div className="frame flex flex-col gap-10 sm:flex-row sm:gap-8">
				<nav aria-label="Footer" className="grid flex-1 grid-cols-2 gap-6 sm:grid-cols-3 md:gap-8">
					{columns.map((links, index) => (
						<ul key={links[0]?.href ?? index} className="space-y-1 md:space-y-2">
							{links.map((link) => (
								<li key={link.href}>
									{link.plain ? (
										<a href={link.href} className={linkClass}>
											{link.label}
										</a>
									) : (
										<Link href={link.href} className={linkClass}>
											{link.label}
										</Link>
									)}
								</li>
							))}
						</ul>
					))}
				</nav>

				<div className="flex flex-col gap-5 sm:w-1/3 xl:pl-24">
					<p className="pl-2.5 text-sm leading-[140%] font-medium tracking-tight text-balance 2xl:text-base">
						Join our newsletter, stay in the loop and never miss a new arrival.
					</p>
					<FooterNewsletter />
				</div>
			</div>

			<div className="frame flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<p className="text-xs text-muted-foreground">
					&copy; {year} {storeName}. All rights reserved.
				</p>
				<PaymentMethods />
			</div>
		</footer>
	);
}
