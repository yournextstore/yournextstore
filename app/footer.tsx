import { Mail, ShoppingBag } from "lucide-react";
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
		return (
			<div>
				<h3 className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Shop</h3>
				<ul className="mt-5 space-y-3">
					{["All Products", "Bags", "Wallets", "Accessories", "Gift Cards"].map((label) => (
						<li key={label}>
							<Link
								href="/products"
								className="text-sm text-foreground/70 hover:text-foreground transition-colors"
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
			<h3 className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-foreground/70 hover:text-foreground transition-colors"
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
			<h3 className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-foreground/70 hover:text-foreground transition-colors"
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
		<footer className="bg-secondary border-t border-border">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Top giant wordmark */}
				<div className="pt-16 pb-10 text-center">
					<p className="font-display text-[18vw] sm:text-[14vw] leading-[0.9] tracking-tighter text-foreground/[0.08] select-none">
						YourNextStore
					</p>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-12 gap-10 pb-12">
					{/* Brand */}
					<div className="col-span-2 md:col-span-4">
						<Link
							href="/"
							className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-4 py-2 font-display font-medium"
						>
							<ShoppingBag className="h-4 w-4" />
							Your Next Store
						</Link>
						<p className="mt-5 text-sm text-foreground/70 leading-relaxed max-w-xs">
							Refined leather goods, made in small batches. Heirloom craftsmanship designed for daily wear.
						</p>
						<div className="mt-6 flex items-center gap-2">
							<a
								href="mailto:hello@yournextstore.com"
								aria-label="Email"
								className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background hover:bg-accent transition-colors"
							>
								<Mail className="h-4 w-4" />
							</a>
							<span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 h-10 text-xs text-foreground/70">
								<span className="h-1.5 w-1.5 rounded-full bg-tan" />
								In stock & shipping daily
							</span>
						</div>
					</div>

					<div className="md:col-span-2">
						<FooterCollections />
					</div>

					<div className="md:col-span-2">
						<h3 className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Support</h3>
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
									className="text-sm text-foreground/70 hover:text-foreground transition-colors"
								>
									FAQ
								</Link>
							</li>
							<FooterBlogLink />
							<li>
								<Link
									href="/faq"
									className="text-sm text-foreground/70 hover:text-foreground transition-colors"
								>
									Shipping & returns
								</Link>
							</li>
							<li>
								<Link
									href="/faq"
									className="text-sm text-foreground/70 hover:text-foreground transition-colors"
								>
									Care guide
								</Link>
							</li>
							<li>
								<Link
									href="/faq"
									className="text-sm text-foreground/70 hover:text-foreground transition-colors"
								>
									Lifetime repairs
								</Link>
							</li>
						</ul>
					</div>

					<div className="md:col-span-2">
						<FooterLegalPages />
					</div>

					<div className="col-span-2 md:col-span-2">
						<h3 className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Atelier</h3>
						<address className="mt-5 text-sm not-italic text-foreground/70 leading-relaxed">
							14 Tannery Lane
							<br />
							Florence, IT
							<br />
							Mon–Sat · 10–18
						</address>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-border flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-sm text-foreground/60">&copy; {year} Your Next Store · All rights reserved.</p>
					<PaymentMethods className="text-foreground/70" />
					<p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
						Crafted with care · Florence — Brooklyn
					</p>
				</div>
			</div>
		</footer>
	);
}
