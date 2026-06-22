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
			<Link href="/blog" className="text-sm text-foreground/65 hover:text-magenta transition-colors">
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
			<Link href="/contact" className="text-sm text-foreground/65 hover:text-magenta transition-colors">
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
			<h3 className="text-[11px] font-semibold tracking-[0.22em] uppercase text-foreground">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-foreground/65 hover:text-magenta transition-colors"
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
			<h3 className="text-[11px] font-semibold tracking-[0.22em] uppercase text-foreground">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-foreground/65 hover:text-magenta transition-colors"
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
		<footer className="bg-cream border-t border-border/60">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 grid grid-cols-2 gap-y-12 gap-x-8 sm:grid-cols-4 lg:grid-cols-5">
					<div className="col-span-2 sm:col-span-4 lg:col-span-2 sm:max-w-sm">
						<Link href="/" className="inline-flex flex-col">
							<span className="font-display text-3xl tracking-tight text-foreground leading-none">
								Your<span className="italic text-magenta">Next</span>Store
							</span>
							<span className="mt-1 text-[10px] uppercase tracking-[0.32em] text-foreground/60">body</span>
						</Link>
						<p className="mt-5 text-sm text-foreground/65 leading-relaxed max-w-xs">
							Body-positive essentials, made to disappear under everything and stay put through anything.
						</p>
						<div className="mt-6 flex items-center gap-3">
							{["IG", "TT", "FB", "PIN"].map((handle) => (
								<a
									key={handle}
									href="/"
									className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white border border-border text-[10px] tracking-[0.14em] font-semibold text-foreground hover:bg-magenta hover:text-white hover:border-magenta transition-colors"
								>
									{handle}
								</a>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-[11px] font-semibold tracking-[0.22em] uppercase text-foreground">Help</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<Link
									href="/about"
									className="text-sm text-foreground/65 hover:text-magenta transition-colors"
								>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link href="/faq" className="text-sm text-foreground/65 hover:text-magenta transition-colors">
									FAQ
								</Link>
							</li>
							<li>
								<Link
									href="/products"
									className="text-sm text-foreground/65 hover:text-magenta transition-colors"
								>
									Fit Guide
								</Link>
							</li>
							<li>
								<Link
									href="/products"
									className="text-sm text-foreground/65 hover:text-magenta transition-colors"
								>
									Shipping & Returns
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="py-6 border-t border-border/60 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-xs text-foreground/55">&copy; {year} Your Next Store. Designed with love.</p>
					<p className="text-[10px] tracking-[0.28em] uppercase text-foreground/55">
						Skin-safe · Reusable · Body-positive
					</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
