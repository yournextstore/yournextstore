import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { Leaf } from "@/components/sections/leaves";
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
			<Link href="/blog" className="text-sm text-cream/75 hover:text-cream transition-colors">
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
			<Link href="/contact" className="text-sm text-cream/75 hover:text-cream transition-colors">
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
			<h3 className="font-display uppercase tracking-[0.22em] text-sm text-marigold">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-cream/75 hover:text-cream transition-colors"
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
			<h3 className="font-display uppercase tracking-[0.22em] text-sm text-marigold">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-cream/75 hover:text-cream transition-colors"
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
		<footer className="relative overflow-hidden bg-forest text-cream">
			<div className="absolute -top-8 -left-8 opacity-30">
				<Leaf className="w-32 h-48 -rotate-12" color="#2e7d3a" />
			</div>
			<div className="absolute -bottom-12 -right-10 opacity-30">
				<Leaf className="w-40 h-56 rotate-12" color="#2e7d3a" />
			</div>
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-10">
					<div className="col-span-2">
						<Link href="/" className="font-display text-3xl uppercase tracking-tight text-cream">
							Your Next Store
							<span className="text-marigold">.</span>
						</Link>
						<p className="mt-5 max-w-xs text-sm text-cream/70 leading-relaxed">
							Plant-based goods, sourced thoughtfully and made for every table. Inclusivity, made delicious.
						</p>
						<div className="mt-6 flex gap-3">
							{["IG", "TT", "YT", "X"].map((label) => (
								<span
									key={label}
									className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream/25 text-xs font-bold tracking-wider hover:bg-cream hover:text-forest transition-colors"
								>
									{label}
								</span>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="font-display uppercase tracking-[0.22em] text-sm text-marigold">Help</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<Link href="/about" className="text-sm text-cream/75 hover:text-cream transition-colors">
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link href="/faq" className="text-sm text-cream/75 hover:text-cream transition-colors">
									FAQ
								</Link>
							</li>
							<li>
								<Link href="/products" className="text-sm text-cream/75 hover:text-cream transition-colors">
									All Products
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-cream/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
					<p className="text-xs text-cream/55 tracking-wider uppercase">
						&copy; {year} Your Next Store. Grown with love.
					</p>
					<div className="flex flex-wrap items-center gap-4">
						<p className="text-xs text-cream/55 tracking-wider uppercase">Plant-powered &amp; family-run</p>
						<PaymentMethods />
					</div>
				</div>
			</div>
		</footer>
	);
}
