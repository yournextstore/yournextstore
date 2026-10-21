import { cacheLife } from "next/cache";
import Link from "next/link";
import { LogoMark } from "@/components/bento/logo-mark";
import { PaymentMethods } from "@/components/payment-methods";
import { commerce, meGetCached } from "@/lib/commerce";
import { getStoreName } from "@/lib/listing";

type FooterLink = { href: string; label: string };

// One cached read for the whole menu: the reference footer is a single column of links.
async function getFooterMenu(): Promise<FooterLink[]> {
	"use cache";
	cacheLife("hours");
	const [me, legal] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
	]);
	const tools = me?.store.settings?.enabledTools;
	return [
		{ href: "/", label: "Home" },
		{ href: "/about", label: "About" },
		...legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
		...(tools?.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
		...(tools?.blog ? [{ href: "/blog", label: "Blog" }] : []),
		{ href: "/faq", label: "FAQ" },
	];
}

// `new Date()` is an unstable value: reading it during the prerender is an error.
// Caching pins it to the entry.
async function getCopyrightYear() {
	"use cache";
	cacheLife("days");
	return new Date().getFullYear();
}

export async function Footer() {
	const [year, storeName, menu] = await Promise.all([getCopyrightYear(), getStoreName(), getFooterMenu()]);

	return (
		<footer className="text-sm text-muted-foreground">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-6 border-t border-neutral-200 px-6 py-12 text-sm md:flex-row md:gap-12 md:px-4 wide:px-0 dark:border-neutral-700">
				<div>
					<Link className="flex items-center gap-2 text-black md:pt-1 dark:text-white" href="/">
						<LogoMark name={storeName} size="sm" />
						<span className="uppercase">{storeName}</span>
					</Link>
				</div>
				<nav aria-label="Footer">
					<ul>
						{menu.map((item) => (
							<li key={item.href}>
								<Link
									href={item.href}
									className="block p-2 text-lg underline-offset-4 hover:text-black hover:underline md:inline-block md:text-sm dark:hover:text-neutral-300"
								>
									{item.label}
								</Link>
							</li>
						))}
					</ul>
				</nav>
				<div className="md:ml-auto">
					<PaymentMethods />
				</div>
			</div>
			<div className="border-t border-neutral-200 py-6 text-sm dark:border-neutral-700">
				<div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-1 px-4 md:flex-row md:gap-0 md:px-4 wide:px-0">
					<p>
						&copy; {year} {storeName}
						{storeName.endsWith(".") ? "" : "."} All rights reserved.
					</p>
					<hr className="mx-4 hidden h-4 w-px border-l border-neutral-400 md:inline-block" />
					<p>
						<Link href="/products" className="hover:text-black dark:hover:text-white">
							Shop all products
						</Link>
					</p>
					<p className="md:ml-auto">
						<a href="/account" className="text-black hover:underline underline-offset-4 dark:text-white">
							My account
						</a>
					</p>
				</div>
			</div>
		</footer>
	);
}
