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
			<Link href="/blog" className="text-sm text-ink/85 hover:text-terracotta transition-colors">
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
			<Link href="/contact" className="text-sm text-ink/85 hover:text-terracotta transition-colors">
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
			<h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink/60">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-ink/85 hover:text-terracotta transition-colors"
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
			<h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink/60">Fine print</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-ink/85 hover:text-terracotta transition-colors"
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
		<footer className="bg-[color:var(--secondary)] border-t border-border/60">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-10">
					{/* Brand */}
					<div className="col-span-2 sm:max-w-xs">
						<Link href="/" className="inline-flex items-baseline gap-1.5 leading-none">
							<span className="font-display text-3xl text-ink leading-none">yournext</span>
							<span className="font-display text-base text-terracotta leading-none -ml-0.5">store</span>
						</Link>
						<p className="mt-4 text-sm text-clay leading-relaxed max-w-xs">
							Protein enzymes and editorial wellness staples — built for the muscle, mind, and metabolism.
						</p>
						<p className="mt-6 text-[10px] tracking-[0.28em] uppercase text-ink/50 font-semibold">
							Made with intent in California
						</p>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Support */}
					<div>
						<h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink/60">Support</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<Link href="/about" className="text-sm text-ink/85 hover:text-terracotta transition-colors">
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link href="/faq" className="text-sm text-ink/85 hover:text-terracotta transition-colors">
									FAQ
								</Link>
							</li>
							<li>
								<Link
									href="/products"
									className="text-sm text-ink/85 hover:text-terracotta transition-colors"
								>
									Shop all
								</Link>
							</li>
							<li>
								<a
									href="mailto:hello@yournextstore.com"
									className="text-sm text-ink/85 hover:text-terracotta transition-colors"
								>
									Contact
								</a>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					{/* Legal */}
					<FooterLegalPages />
				</div>

				{/* Bottom bar */}
				<div className="py-8 border-t border-border/60 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-[11px] uppercase tracking-[0.18em] text-ink/55 font-semibold">
					<p>&copy; {year} Your Next Store. All rights reserved.</p>
					<p>Free US shipping · 30-day money back</p>
					<PaymentMethods className="normal-case tracking-normal" />
				</div>
			</div>
		</footer>
	);
}
