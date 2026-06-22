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
			<Link
				href="/blog"
				className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
			>
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
			<Link
				href="/contact"
				className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
			>
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
		return (
			<div>
				<h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">Shop</h3>
				<ul className="mt-5 space-y-3">
					{["New", "Bras", "Briefs", "Lingerie", "Sleepwear"].map((label) => (
						<li key={label}>
							<Link
								href="/products"
								className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
							>
								{label}
							</Link>
						</li>
					))}
				</ul>
			</div>
		);
	}

	return (
		<div>
			<h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
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
			<h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
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
		<footer className="border-t border-border bg-[#f5ede2]">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-2 gap-10 py-16 sm:grid-cols-3 sm:gap-12 lg:grid-cols-5 lg:py-20">
					{/* Brand */}
					<div className="col-span-2 sm:col-span-3 lg:col-span-2">
						<Link
							href="/"
							className="font-display text-[28px] tracking-[0.04em] text-foreground"
							style={{ fontFamily: "var(--font-cormorant)" }}
						>
							Your Next Store
						</Link>
						<p className="mt-5 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
							Soft-luxe intimates and lingerie — heirloom lace, second-skin comfort and ethically made.
						</p>
						<div className="mt-6 flex items-center gap-3">
							{["Instagram", "TikTok", "Pinterest"].map((label) => (
								<span
									key={label}
									className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/70 hover:text-foreground"
								>
									{label}
								</span>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">Help</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<Link
									href="/about"
									className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
								>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link
									href="/faq"
									className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
								>
									FAQ
								</Link>
							</li>
							<li>
								<span className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">
									Shipping & Returns
								</span>
							</li>
							<li>
								<span className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">
									Size Guide
								</span>
							</li>
							<li>
								<span className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">
									Contact
								</span>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				{/* Bottom bar */}
				<div className="flex flex-col gap-4 border-t border-foreground/10 py-6 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-4">
						<select
							aria-label="Currency"
							className="rounded-full border border-foreground/15 bg-transparent px-4 py-1.5 text-[11px] uppercase tracking-[0.16em] text-foreground/80"
						>
							<option>AUD $</option>
							<option>USD $</option>
							<option>EUR €</option>
							<option>GBP £</option>
						</select>
						<PaymentMethods />
					</div>
					<p className="text-[11px] uppercase tracking-[0.16em] text-foreground/60">
						© {year} Your Next Store. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
