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
			<Link href="/blog" className="text-sm text-foreground hover:text-foreground/70 transition-colors">
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
			<Link href="/contact" className="text-sm text-foreground hover:text-foreground/70 transition-colors">
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
			<h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Collections</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-foreground hover:text-foreground/70 transition-colors"
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
			<h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-foreground hover:text-foreground/70 transition-colors"
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
		<footer className="bg-background border-t border-border">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="pt-16 sm:pt-20 pb-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-12 gap-10 sm:gap-8">
					{/* Brand */}
					<div className="col-span-2 lg:col-span-5 lg:pr-10">
						<Link
							href="/"
							className="inline-flex items-center gap-2 text-base font-semibold tracking-tight text-foreground"
						>
							<span
								aria-hidden
								className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background"
							>
								<span className="block h-2.5 w-2.5 rounded-sm bg-accent" />
							</span>
							Your Next Store
						</Link>
						<p className="mt-5 text-sm leading-relaxed text-muted-foreground max-w-sm">
							A small, opinionated shop of everyday essentials — built to outlast a trend cycle and to make
							ordering feel effortless.
						</p>
						<div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground">
							<span className="inline-block h-1.5 w-1.5 rounded-full bg-accent pulse-ring" />
							Studio open · ships within 24h
						</div>
					</div>

					{/* Collections */}
					<div className="lg:col-span-2">
						<FooterCollections />
					</div>

					{/* Support */}
					<div className="lg:col-span-2">
						<h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
							Support
						</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<Link
									href="/about"
									className="text-sm text-foreground hover:text-foreground/70 transition-colors"
								>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link
									href="/faq"
									className="text-sm text-foreground hover:text-foreground/70 transition-colors"
								>
									FAQ
								</Link>
							</li>
							<li>
								<Link
									href="/products"
									className="text-sm text-foreground hover:text-foreground/70 transition-colors"
								>
									All products
								</Link>
							</li>
							<li>
								<Link
									href="/search"
									className="text-sm text-foreground hover:text-foreground/70 transition-colors"
								>
									Search
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					{/* Legal */}
					<div className="lg:col-span-3">
						<FooterLegalPages />
					</div>
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-border flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
					<p>&copy; {year} Your Next Store. All rights reserved.</p>
					<p className="tracking-tight">Made with quiet attention — shipped from the studio.</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
