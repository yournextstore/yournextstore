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
				className="font-display text-base font-bold uppercase tracking-tight text-[color:var(--color-yns-cream)] hover:text-[color:var(--color-yns-dust)] transition-colors"
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
				className="font-display text-base font-bold uppercase tracking-tight text-[color:var(--color-yns-cream)] hover:text-[color:var(--color-yns-dust)] transition-colors"
			>
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
			<h3 className="text-[10px] tracking-utility font-semibold text-[color:var(--color-yns-cream)]/55 mb-5">
				COLLECTIONS
			</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="font-display text-base font-bold uppercase tracking-tight text-[color:var(--color-yns-cream)] hover:text-[color:var(--color-yns-dust)] transition-colors"
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
			<h3 className="text-[10px] tracking-utility font-semibold text-[color:var(--color-yns-cream)]/55 mb-5">
				FINE PRINT
			</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="font-display text-base font-bold uppercase tracking-tight text-[color:var(--color-yns-cream)] hover:text-[color:var(--color-yns-dust)] transition-colors"
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
		<footer className="bg-[color:var(--color-yns-ink)] text-[color:var(--color-yns-cream)]">
			<div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-10">
				{/* Massive wordmark */}
				<div aria-hidden="true" className="pt-16 pb-6 sm:pt-20 sm:pb-8 overflow-hidden">
					<div className="font-display font-black uppercase leading-[0.85] tracking-[-0.04em] text-[color:var(--color-yns-dust)] text-[18vw] sm:text-[14vw] lg:text-[180px] whitespace-nowrap">
						YOUR&nbsp;NEXT&nbsp;STORE
					</div>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-4 gap-10 sm:gap-12 pb-12 border-t border-[color:var(--color-yns-cream)]/15 pt-12">
					<div className="col-span-2 sm:col-span-1 max-w-xs">
						<p className="text-[10px] tracking-utility font-semibold text-[color:var(--color-yns-cream)]/55 mb-5">
							YNS WORKSHOP
						</p>
						<p className="text-sm text-[color:var(--color-yns-cream)]/70 leading-relaxed">
							Field-tested, workshop-built goods for travelers, players, and people who notice the details.
							Made in small batches. Backed for life.
						</p>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-[10px] tracking-utility font-semibold text-[color:var(--color-yns-cream)]/55 mb-5">
							SUPPORT
						</h3>
						<ul className="space-y-3">
							<li>
								<Link
									href="/about"
									className="font-display text-base font-bold uppercase tracking-tight text-[color:var(--color-yns-cream)] hover:text-[color:var(--color-yns-dust)] transition-colors"
								>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link
									href="/faq"
									className="font-display text-base font-bold uppercase tracking-tight text-[color:var(--color-yns-cream)] hover:text-[color:var(--color-yns-dust)] transition-colors"
								>
									FAQ
								</Link>
							</li>
							<li>
								<Link
									href="/products"
									className="font-display text-base font-bold uppercase tracking-tight text-[color:var(--color-yns-cream)] hover:text-[color:var(--color-yns-dust)] transition-colors"
								>
									Shipping &amp; Returns
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="py-6 border-t border-[color:var(--color-yns-cream)]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<p className="text-[10px] tracking-utility font-semibold text-[color:var(--color-yns-cream)]/55">
						© {year} YOUR NEXT STORE — ALL RIGHTS RESERVED
					</p>
					<div className="flex flex-wrap items-center gap-5">
						<PaymentMethods />
						<div className="flex items-center gap-5 text-[10px] tracking-utility font-semibold text-[color:var(--color-yns-cream)]/55">
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-[color:var(--color-yns-dust)] transition-colors"
							>
								INSTAGRAM
							</a>
							<a
								href="https://youtube.com"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-[color:var(--color-yns-dust)] transition-colors"
							>
								YOUTUBE
							</a>
							<a
								href="https://twitter.com"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-[color:var(--color-yns-dust)] transition-colors"
							>
								TWITTER
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
