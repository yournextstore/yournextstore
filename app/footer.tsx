import { cacheLife } from "next/cache";
import Link from "next/link";
import { commerce, meGetCached } from "@/lib/commerce";

const linkClass = "text-white underline-offset-4 hover:underline";

async function FooterLinks({ accountHref }: { accountHref: string }) {
	"use cache";
	cacheLife("hours");

	const [me, pages] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
	]);
	const tools = me?.store.settings?.enabledTools;
	const links = [
		{ href: "/products", label: "Products" },
		{ href: "/about", label: "About" },
		{ href: "/faq", label: "Help Centre" },
		...(tools?.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
		...(tools?.blog ? [{ href: "/blog", label: "Blog" }] : []),
		...pages.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
	];

	return (
		<ul className="flex flex-wrap gap-x-4 gap-y-1 md:justify-end">
			{links.map((link) => (
				<li key={link.href}>
					<Link href={link.href} className={linkClass}>
						{link.label}
					</Link>
				</li>
			))}
			<li>
				{/* Plain <a>: /account is a proxied zone. */}
				<a href={accountHref} className={linkClass}>
					Account
				</a>
			</li>
		</ul>
	);
}

// `new Date()` is an unstable value: now that the footer is part of the prerendered
// shell, reading it during the prerender is an error. Caching pins it to the entry.
async function getCopyrightYear() {
	"use cache";
	cacheLife("days");

	return new Date().getFullYear();
}

export async function Footer({ shopName, accountHref }: { shopName: string; accountHref: string }) {
	const year = await getCopyrightYear();

	return (
		<footer className="bg-primary p-6 pb-12 text-primary-foreground">
			<div className="mx-auto flex max-w-[1400px] flex-col items-start justify-start gap-6 p-6 md:flex-row md:items-end md:justify-between">
				<div>
					<Link href="/" className="text-2xl font-semibold tracking-tight md:text-3xl">
						{shopName}
					</Link>
					<p>Online shopping made easy</p>
				</div>
				<div className="flex flex-col items-start gap-1 text-sm text-secondary md:items-end">
					<FooterLinks accountHref={accountHref} />
					<p>
						&copy; {year} {shopName}. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
