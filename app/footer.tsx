import { cacheLife } from "next/cache";
import Link from "next/link";
import { commerce } from "@/lib/commerce";
import { getNavData } from "@/lib/nav";

const footerLink = "text-sm text-neutral-400 transition-colors hover:text-neutral-200";

async function FooterLegalPages() {
	"use cache";
	cacheLife("hours");

	const pages = await commerce.legalPageBrowse();

	if (pages.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h2 className="text-sm font-medium text-neutral-300">Policies</h2>
			<ul className="mt-4 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link href={`/legal${page.href}`} className={footerLink}>
							{page.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

// `new Date()` is an unstable value: now that the footer is part of the prerendered
// shell, reading it during the prerender is an error. Caching pins it to the entry.
async function getCopyrightYear() {
	"use cache";
	cacheLife("days");

	return new Date().getFullYear();
}

export async function Footer() {
	const [year, nav] = await Promise.all([getCopyrightYear(), getNavData()]);

	return (
		<footer className="bg-night text-neutral-300">
			<div className="shell py-12">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-5">
					<div className="md:col-span-2">
						<span className="text-xl font-bold text-white">{nav.storeName}</span>
						<p className="mt-4 max-w-md text-sm text-neutral-400">
							{nav.storeDescription ??
								"Plain, hard-wearing bags for the commute and the weekend. Browse the full range, or start with one of our collections."}
						</p>
						<Link
							href="/products"
							className="mt-4 inline-block text-sm font-medium text-white transition-colors hover:text-neutral-200"
						>
							Shop the full range &rarr;
						</Link>
					</div>

					<div>
						<h2 className="text-sm font-medium text-neutral-300">Shop</h2>
						<ul className="mt-4 space-y-3">
							<li>
								<Link href="/products" className={footerLink}>
									All Products
								</Link>
							</li>
							{nav.shopLinks.map((link) => (
								<li key={link.href}>
									<Link href={link.href} className={footerLink}>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h2 className="text-sm font-medium text-neutral-300">Account</h2>
						<ul className="mt-4 space-y-3">
							<li>
								{/* Plain <a>: /account is a proxied zone (see AGENTS.md). */}
								<a href="/account" className={footerLink}>
									My Account
								</a>
							</li>
							{nav.secondary.map((link) => (
								<li key={link.href}>
									<Link href={link.href} className={footerLink}>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="mt-8 border-t border-neutral-800 pt-8 text-center text-xs text-neutral-400">
					<p>
						&copy; {year} {nav.storeName}. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
