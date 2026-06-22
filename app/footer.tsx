import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
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
			<Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
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
			<Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
				Contact Us
			</Link>
		</li>
	);
}

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ active: true, limit: 6 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							{collection.name}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

async function FooterLegalPages() {
	"use cache";
	cacheLife("hours");

	const pages = await commerce.legalPageBrowse();

	if (pages.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
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
	const year = await getCopyrightYear();

	return (
		<footer className="border-t border-border bg-background">
			<div className="mx-auto max-w-[1440px] px-6 lg:px-12">
				<div className="grid grid-cols-2 gap-10 py-16 sm:grid-cols-3 lg:grid-cols-5 lg:gap-12 lg:py-20">
					<div className="col-span-2 lg:col-span-2 lg:max-w-xs">
						<Link href="/" className="font-display text-xl tracking-[0.28em] uppercase text-foreground">
							Your Next Store
						</Link>
						<p className="mt-5 text-sm leading-relaxed text-muted-foreground">
							A destination for considered designer fashion — curated by the YNS atelier, shipped from
							Antwerp.
						</p>
						<div className="mt-6 flex items-center gap-3 text-muted-foreground">
							{["Instagram", "Pinterest", "TikTok", "YouTube"].map((label) => (
								<span key={label} className="text-[11px] uppercase tracking-[0.22em]">
									{label[0]}
								</span>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground">Support</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<Link
									href="/about"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link
									href="/faq"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									Frequently Asked
								</Link>
							</li>
							<li>
								<span className="text-sm text-muted-foreground">Shipping & Returns</span>
							</li>
							<li>
								<span className="text-sm text-muted-foreground">Size Guide</span>
							</li>
							<li>
								<span className="text-sm text-muted-foreground">Personal Styling</span>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="flex flex-col gap-3 border-t border-border py-6 text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
					<p>&copy; {year} Your Next Store. Curated in Antwerp. All rights reserved.</p>
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
						<p>Worldwide express shipping · EUR · USD · GBP</p>
						<PaymentMethods />
					</div>
				</div>
			</div>
		</footer>
	);
}
