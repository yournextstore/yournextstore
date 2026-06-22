import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { WhaleLogo } from "@/components/whale-logo";
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
				className={`${COLUMN_CLASS} hover:text-[color:var(--color-yns-navy)] transition-colors`}
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
				className={`${COLUMN_CLASS} hover:text-[color:var(--color-yns-navy)] transition-colors`}
			>
				Contact Us
			</Link>
		</li>
	);
}

const COLUMN_CLASS = "text-[11px] tracking-[0.32em] uppercase text-[color:var(--color-yns-navy)]/70";
const HEADER_CLASS = "text-[11px] tracking-[0.4em] uppercase text-[color:var(--color-yns-navy)]";

async function FooterShop() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ active: true, limit: 5 });

	return (
		<div>
			<h3 className={HEADER_CLASS}>Shop</h3>
			<ul className="mt-5 space-y-3">
				<li>
					<Link
						href="/products"
						className={`${COLUMN_CLASS} hover:text-[color:var(--color-yns-navy)] transition-colors`}
					>
						All blends
					</Link>
				</li>
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className={`${COLUMN_CLASS} hover:text-[color:var(--color-yns-navy)] transition-colors`}
						>
							{collection.name}
						</Link>
					</li>
				))}
				<li>
					<Link
						href="#tea-club"
						className={`${COLUMN_CLASS} hover:text-[color:var(--color-yns-navy)] transition-colors`}
					>
						Tea Club
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
			<h3 className={HEADER_CLASS}>Help</h3>
			<ul className="mt-5 space-y-3">
				<li>
					<Link
						href="/faq"
						className={`${COLUMN_CLASS} hover:text-[color:var(--color-yns-navy)] transition-colors`}
					>
						FAQ
					</Link>
				</li>
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className={`${COLUMN_CLASS} hover:text-[color:var(--color-yns-navy)] transition-colors`}
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
		<footer className="bg-[color:var(--color-yns-cream)] border-t border-[color:var(--color-yns-blue-200)]/60">
			<div className="max-w-7xl mx-auto px-6 lg:px-10">
				<div className="py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
					<div className="col-span-2 md:col-span-2 max-w-xs">
						<WhaleLogo />
						<p className="mt-6 text-sm text-[color:var(--color-yns-navy)]/65 leading-relaxed font-serif italic">
							A better way to drink tea. Loose leaf, single-garden, served slowly.
						</p>
					</div>

					<FooterShop />

					<div>
						<h3 className={HEADER_CLASS}>Learn</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<Link
									href="/about"
									className={`${COLUMN_CLASS} hover:text-[color:var(--color-yns-navy)] transition-colors`}
								>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link
									href="#story"
									className={`${COLUMN_CLASS} hover:text-[color:var(--color-yns-navy)] transition-colors`}
								>
									Our story
								</Link>
							</li>
							<li>
								<Link
									href="#story"
									className={`${COLUMN_CLASS} hover:text-[color:var(--color-yns-navy)] transition-colors`}
								>
									Brewing guides
								</Link>
							</li>
							<li>
								<Link
									href="#story"
									className={`${COLUMN_CLASS} hover:text-[color:var(--color-yns-navy)] transition-colors`}
								>
									Journal
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="py-6 border-t border-[color:var(--color-yns-blue-200)]/60 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-[11px] tracking-[0.3em] uppercase text-[color:var(--color-yns-navy)]/55">
						&copy; {year} Your Next Store
					</p>
					<div className="flex items-center gap-5 text-[color:var(--color-yns-navy)]/55">
						<a
							href="https://instagram.com"
							aria-label="Instagram"
							className="hover:text-[color:var(--color-yns-navy)] transition-colors"
						>
							<svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
								<title>instagram</title>
								<rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
								<circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
								<circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
							</svg>
							<span className="sr-only">Instagram</span>
						</a>
						<a
							href="https://twitter.com"
							aria-label="Twitter"
							className="hover:text-[color:var(--color-yns-navy)] transition-colors"
						>
							<svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
								<title>twitter</title>
								<path d="M18 4h3l-7 8 8 8h-6l-5-5-5 5H3l7-8L3 4h6l5 5 4-5z" />
							</svg>
							<span className="sr-only">Twitter</span>
						</a>
					</div>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
