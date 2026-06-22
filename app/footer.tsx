import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { FooterNewsletter } from "@/components/sections/footer-newsletter";
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
			<h3 className="text-[10px] tracking-[0.28em] uppercase font-medium text-foreground">Shop</h3>
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
				<li>
					<Link
						href="/products"
						className="text-sm text-muted-foreground hover:text-foreground transition-colors"
					>
						All Products
					</Link>
				</li>
			</ul>
		</div>
	);
}

async function FooterLegalPages() {
	"use cache";
	cacheLife("hours");

	const pages = await commerce.legalPageBrowse();

	return (
		<div>
			<h3 className="text-[10px] tracking-[0.28em] uppercase font-medium text-foreground">Studio</h3>
			<ul className="mt-5 space-y-3">
				<li>
					<Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
						FAQ
					</Link>
				</li>
				<li>
					<Link
						href="/#about"
						className="text-sm text-muted-foreground hover:text-foreground transition-colors"
					>
						Our Story
					</Link>
				</li>
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
		<footer className="border-t border-border bg-[var(--bone)]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Newsletter band */}
				<div className="py-14 sm:py-20 border-b border-border">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
						<div>
							<span className="text-[10px] tracking-[0.28em] uppercase text-[var(--mahogany)] font-medium">
								Letter from the studio
							</span>
							<h2 className="mt-4 font-display text-4xl sm:text-5xl text-foreground leading-[1.05]">
								Stay close. Hear when new pieces are kilned.
							</h2>
							<p className="mt-5 text-[14px] leading-relaxed text-muted-foreground max-w-md">
								A quiet, monthly letter on slow-living, new firings, and pieces released only to subscribers.
							</p>
						</div>
						<FooterNewsletter />
					</div>
				</div>

				{/* Columns */}
				<div className="py-14 grid grid-cols-2 sm:grid-cols-4 gap-8">
					<div className="col-span-2">
						<Link href="/" className="font-display text-2xl tracking-[0.1em] uppercase text-foreground">
							Your Next Store
						</Link>
						<p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
							Products for the soul. Handcrafted ceramics, candles and home objects, made slowly in small
							studios.
						</p>
						<div className="mt-6 flex items-center gap-3">
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Instagram"
								className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.8"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<title>Instagram</title>
									<rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
									<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
									<line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
								</svg>
							</a>
							<a
								href="https://twitter.com"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Twitter"
								className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="currentColor"
								>
									<title>Twitter</title>
									<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
								</svg>
							</a>
							<a
								href="https://pinterest.com"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Pinterest"
								className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.8"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<title>Pinterest</title>
									<circle cx="12" cy="12" r="10" />
									<path d="M8 12s2-1 4 0 4 0 4 0" />
									<path d="M11 11v8" />
								</svg>
							</a>
						</div>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Support */}
					<div>
						<h3 className="text-[10px] tracking-[0.28em] uppercase font-medium text-foreground">Support</h3>
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
									FAQ
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-border flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-xs text-muted-foreground tracking-wide">
						&copy; {year} Your Next Store — Made slowly, with intention.
					</p>
					<div className="flex flex-wrap items-center gap-x-6 gap-y-3">
						<p className="text-xs text-muted-foreground tracking-wide">
							Designed in studio. Shipped worldwide.
						</p>
						<PaymentMethods />
					</div>
				</div>
			</div>
		</footer>
	);
}
