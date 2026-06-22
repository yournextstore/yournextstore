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
			<Link href="/blog" className="text-sm text-white/60 transition-colors hover:text-white">
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
			<Link href="/contact" className="text-sm text-white/60 transition-colors hover:text-white">
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
			<h3 className="text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h3>
			<ul className="mt-4 space-y-3">
				<li>
					<Link href="/products" className="text-sm text-white/60 transition-colors hover:text-white">
						Shop All
					</Link>
				</li>
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-white/60 transition-colors hover:text-white"
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
			<h3 className="text-sm font-semibold uppercase tracking-wider text-white">Support</h3>
			<ul className="mt-4 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-white/60 transition-colors hover:text-white"
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
		<footer className="bg-brand-dark text-white">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid gap-8 py-12 sm:grid-cols-2 sm:py-16 lg:grid-cols-4">
					{/* Brand */}
					<div>
						<Link href="/" className="font-heading text-2xl font-bold text-white">
							Your Next Store
						</Link>
						<p className="mt-4 text-sm leading-relaxed text-white/60">
							We blend nature and science to create effective, ethical skincare. Our high-quality products
							nourish and enhance your natural beauty.
						</p>
					</div>

					{/* Collections / Quick Links */}
					<FooterCollections />

					{/* Legal / Support */}
					<FooterLegalPages />

					{/* Company */}
					<div>
						<h3 className="text-sm font-semibold uppercase tracking-wider text-white">Company</h3>
						<ul className="mt-4 space-y-3">
							<li>
								<Link href="/" className="text-sm text-white/60 transition-colors hover:text-white">
									Our Story
								</Link>
							</li>
							<li>
								<Link href="/about" className="text-sm text-white/60 transition-colors hover:text-white">
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link href="/products" className="text-sm text-white/60 transition-colors hover:text-white">
									Shop
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="flex flex-col gap-4 border-t border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-sm text-white/40">&copy; {year} Your Next Store. All rights reserved.</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
