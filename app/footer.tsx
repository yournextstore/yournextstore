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

	const collections = await commerce.collectionBrowse({ active: true, limit: 5 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground mb-5">Shop</h3>
			<ul className="space-y-3">
				<li>
					<Link
						href="/products"
						className="text-sm text-muted-foreground hover:text-foreground transition-colors"
					>
						All products
					</Link>
				</li>
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
			<h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground mb-5">Legal</h3>
			<ul className="space-y-3">
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
		<footer className="bg-[var(--cream)] border-t border-foreground/10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-10 lg:gap-12">
					<div className="col-span-2">
						<Link href="/" className="script-logo text-4xl text-[var(--crimson)] inline-block">
							Your Next Store
						</Link>
						<p className="mt-5 text-sm text-muted-foreground leading-relaxed max-w-xs">
							Better-for-you snacks, slow-baked in small batches. 20G of protein, 7 real ingredients, zero
							fine print.
						</p>
						<div className="mt-6 flex items-center gap-3">
							{[
								{
									label: "Instagram",
									path: "M7 2a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5H7Zm0 2h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Zm5 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm5.5-3a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z",
								},
								{
									label: "TikTok",
									path: "M13 3v11.2a3 3 0 1 1-2-2.83V8.3a6 6 0 1 0 6 5.7V8.2a7 7 0 0 0 4 1.3V6.5a4 4 0 0 1-4-3.5h-4Z",
								},
								{
									label: "YouTube",
									path: "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8C22 15.2 22 12 22 12s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z",
								},
							].map((s) => (
								<a
									key={s.label}
									href="https://yournextstore.com"
									className="h-9 w-9 inline-flex items-center justify-center border border-foreground/15 text-foreground/70 hover:bg-foreground hover:text-background hover:border-foreground transition-colors"
								>
									<span className="sr-only">{s.label}</span>
									<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
										<path d={s.path} />
									</svg>
								</a>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground mb-5">Support</h3>
						<ul className="space-y-3">
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
									FAQ
								</Link>
							</li>
							<FooterBlogLink />
							<li>
								<a
									href="mailto:hello@yournextstore.com"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									Contact
								</a>
							</li>
							<li>
								<Link
									href="/products"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									Store locator
								</Link>
							</li>
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="py-6 border-t border-foreground/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
					<p className="text-xs text-muted-foreground">
						&copy; {year} Your Next Store. Slow-baked in small batches.
					</p>
					<div className="flex flex-wrap items-center gap-4">
						<p className="text-xs text-muted-foreground tracking-wide">
							Made with oats, honey & <span className="text-[var(--crimson)]">♡</span>
						</p>
						<PaymentMethods />
					</div>
				</div>
			</div>
		</footer>
	);
}
