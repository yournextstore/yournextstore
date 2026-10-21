import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { getStoreIdentity } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";

type FooterLink = { href: string; label: string };

async function getFooterLinks(): Promise<FooterLink[]> {
	"use cache";
	cacheLife("hours");
	const [identity, legal] = await Promise.all([
		getStoreIdentity(),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
	]);
	return [
		{ href: "/products", label: "Shop" },
		{ href: "/about", label: "About" },
		{ href: "/faq", label: "FAQ" },
		...(identity.contactFormEnabled ? [{ href: "/contact", label: "Contact" }] : []),
		...(identity.blogEnabled ? [{ href: "/blog", label: "Blog" }] : []),
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

/** The original's black footer bar: wordmark on the left, its controls on the right. */
export async function Footer() {
	const [year, links, identity] = await Promise.all([
		getCopyrightYear(),
		getFooterLinks(),
		getStoreIdentity(),
	]);

	return (
		<footer className="bg-ink text-ink-foreground">
			<div className="shell flex flex-col gap-8 py-10 lg:flex-row lg:items-center lg:justify-between lg:py-8">
				<Link href="/" className="text-[1.625rem] font-semibold leading-none tracking-tight">
					{identity.storeName}
				</Link>
				<nav aria-label="Footer">
					<ul className="flex flex-col gap-5 lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-10 lg:gap-y-3">
						{links.map((link) => (
							<li key={link.href}>
								<Link href={link.href} className="text-base transition-opacity hover:opacity-75">
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</div>
			<div className="border-t border-white/15">
				<div className="shell flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-sm text-white/70">
						&copy; {year} {identity.storeName}
					</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
