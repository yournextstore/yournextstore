import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { getShopCategories, getShopCollections } from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";

async function FooterBlogLink() {
	"use cache";
	cacheLife("hours");

	const me = await meGetCached().catch(() => null);
	if (!me?.store.settings?.enabledTools?.blog) {
		return null;
	}

	return (
		<li>
			<Link href="/blog" className="collection-link">
				Blog
			</Link>
		</li>
	);
}

async function FooterContactLink() {
	"use cache";
	cacheLife("hours");

	const me = await meGetCached().catch(() => null);
	if (!me?.store.settings?.enabledTools?.contactForm) {
		return null;
	}

	return (
		<li>
			<Link href="/contact" className="collection-link">
				Contact
			</Link>
		</li>
	);
}

async function FooterLegalLinks() {
	"use cache";
	cacheLife("hours");

	const pages = await commerce.legalPageBrowse();

	return pages.data.map((page) => (
		<li key={page.id}>
			<Link href={`/legal${page.href}`} className="collection-link">
				{page.label}
			</Link>
		</li>
	));
}

async function getFooterData() {
	"use cache";
	cacheLife("hours");
	const [categories, collections, me] = await Promise.all([
		getShopCategories(),
		getShopCollections(),
		meGetCached().catch(() => null),
	]);
	return {
		storeName: me?.store.name || "Your Next Store",
		storeDescription: me?.store.settings?.storeDescription || null,
		links: [
			...collections.slice(0, 3).map((c) => ({ href: `/collection/${c.slug}`, label: c.name })),
			...categories.map((c) => ({ href: `/category/${c.slug}`, label: c.name })),
		].slice(0, 6),
		language: me?.store.settings?.defaultLanguage ?? null,
	};
}

// `new Date()` is an unstable value: now that the footer is part of the prerendered
// shell, reading it during the prerender is an error. Caching pins it to the entry.
async function getCopyrightYear() {
	"use cache";
	cacheLife("days");

	return new Date().getFullYear();
}

/** Deep olive band: wordmark and a serif line, two link columns, a hairline colophon. */
export async function Footer() {
	const [year, data] = await Promise.all([getCopyrightYear(), getFooterData()]);
	const accountHref = data.language ? `/account?lang=${encodeURIComponent(data.language)}` : "/account";

	return (
		<footer className="bg-band text-band-foreground">
			<div className="frame grid gap-10 py-12 sm:grid-cols-[2fr_1fr_1fr] lg:py-16">
				<div className="min-w-0">
					<Link
						href="/"
						className="text-2xl font-medium tracking-[0.18em] uppercase wrap-break-word sm:text-3xl"
					>
						{data.storeName}
					</Link>
					<p className="mt-5 max-w-xs font-display text-2xl leading-snug">
						A little more room
						<br />
						for the everyday.
					</p>
					<p className="mt-4 max-w-xs text-xs leading-6 text-band-muted">
						{data.storeDescription ?? "Pieces chosen slowly, made to be worn often."}
					</p>
				</div>
				<div>
					<h2 className="eyebrow mb-5 text-band-muted">The collection</h2>
					<ul className="flex flex-col items-start gap-3.5 text-xs">
						<li>
							<Link href="/products" className="collection-link">
								All pieces
							</Link>
						</li>
						{data.links.map((link) => (
							<li key={link.href}>
								<Link href={link.href} className="collection-link">
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</div>
				<div>
					<h2 className="eyebrow mb-5 text-band-muted">A little more</h2>
					<ul className="flex flex-col items-start gap-3.5 text-xs">
						<li>
							<Link href="/about" className="collection-link">
								Our story
							</Link>
						</li>
						<li>
							<Link href="/faq" className="collection-link">
								FAQ
							</Link>
						</li>
						<FooterContactLink />
						<FooterBlogLink />
						<li>
							{/* Plain <a>: /account is a proxied zone (see AGENTS.md). */}
							<a href={accountHref} className="collection-link">
								Your account
							</a>
						</li>
						<FooterLegalLinks />
					</ul>
				</div>
			</div>
			<div className="border-t border-band-foreground/15">
				<div className="frame flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-5 text-[10px] leading-5 text-band-muted">
					<span>
						&copy; {year} {data.storeName}. All rights reserved.
					</span>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
