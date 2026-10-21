import { cacheLife } from "next/cache";
import Link from "next/link";
import { FooterNewsletter } from "@/components/footer-newsletter";
import { LogoMark } from "@/components/logo-mark";
import { PaymentMethods } from "@/components/payment-methods";
import { ThemeToggle } from "@/components/theme-toggle";
import { getCategorySummaries, getSocialLinks, getStoreName } from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";

type FooterLink = { title: string; href: string; external?: boolean };
type FooterColumn = { title: string; items: FooterLink[] };

async function getFooterColumns(): Promise<FooterColumn[]> {
	"use cache";
	cacheLife("hours");

	const [me, categories, legal, socials] = await Promise.all([
		meGetCached().catch(() => null),
		getCategorySummaries(),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		getSocialLinks(),
	]);
	const tools = me?.store.settings?.enabledTools;

	const shop: FooterColumn = {
		title: "Shop",
		items: [
			{ title: "All products", href: "/products" },
			...categories
				.slice(0, 4)
				.map((category) => ({ title: category.name, href: `/category/${category.slug}` })),
		],
	};
	const help: FooterColumn = {
		title: "Help",
		items: [
			{ title: "About", href: "/about" },
			{ title: "FAQ", href: "/faq" },
			...(tools?.contactForm ? [{ title: "Contact", href: "/contact" }] : []),
			...(tools?.blog ? [{ title: "Blog", href: "/blog" }] : []),
		],
	};
	const legalColumn: FooterColumn[] =
		legal.data.length > 0
			? [
					{
						title: "Legal",
						items: legal.data.map((page) => ({ title: page.label, href: `/legal${page.href}` })),
					},
				]
			: [];
	const social: FooterColumn[] =
		socials.length > 0
			? [
					{
						title: "Social",
						items: socials.map((link) => ({ title: link.label, href: link.href, external: true })),
					},
				]
			: [];

	return [shop, help, ...legalColumn, ...social];
}

// `new Date()` is an unstable value: now that the footer is part of the prerendered
// shell, reading it during the prerender is an error. Caching pins it to the entry.
async function getCopyrightYear() {
	"use cache";
	cacheLife("days");

	return new Date().getFullYear();
}

export async function Footer() {
	const [year, columns, storeName] = await Promise.all([
		getCopyrightYear(),
		getFooterColumns(),
		getStoreName(),
	]);

	return (
		<footer className="w-full border-t bg-background">
			<div className="shell grid grid-cols-1 gap-8 pt-6 pb-8 lg:py-6">
				<section className="flex flex-col gap-10 pt-6 lg:flex-row lg:gap-20">
					<div>
						<Link href="/" className="flex w-fit items-center gap-2">
							<LogoMark className="size-6" />
							<span className="font-bold">{storeName}</span>
						</Link>
					</div>
					<div className="grid flex-1 grid-cols-1 gap-10 xxs:grid-cols-2 sm:grid-cols-4">
						{columns.map((column) => (
							<div key={column.title} className="space-y-3">
								<h2 className="text-base font-medium">{column.title}</h2>
								<ul className="space-y-2.5">
									{column.items.map((link) => (
										<li key={link.href}>
											<Link
												href={link.href}
												target={link.external ? "_blank" : undefined}
												rel={link.external ? "noreferrer" : undefined}
												className="text-sm text-muted-foreground transition-colors hover:text-foreground"
											>
												{link.title}
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
					<div className="space-y-3 lg:max-w-64">
						<h2 className="text-base font-medium">Subscribe to our newsletter</h2>
						<FooterNewsletter />
					</div>
				</section>
				<section className="flex flex-col gap-4 sm:flex-row sm:items-center">
					<p className="flex-1 text-sm leading-loose text-muted-foreground">
						&copy; {year} <span className="font-semibold text-foreground/90">{storeName}</span>.
					</p>
					<div className="flex items-center gap-3">
						<PaymentMethods />
						<ThemeToggle />
					</div>
				</section>
			</div>
		</footer>
	);
}
