import { cacheLife } from "next/cache";
import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";
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
			<Link href="/blog" className="text-sm text-white/60 hover:text-white transition-colors">
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
			<Link href="/contact" className="text-sm text-white/60 hover:text-white transition-colors">
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
			<h3 className="font-heading text-sm font-semibold tracking-widest uppercase text-white mb-4">
				Collections
			</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-white/60 hover:text-white transition-colors"
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
			<h3 className="font-heading text-sm font-semibold tracking-widest uppercase text-white mb-4">About</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-white/60 hover:text-white transition-colors"
						>
							{page.label}
						</Link>
					</li>
				))}
				<li>
					<Link href="/search" className="text-sm text-white/60 hover:text-white transition-colors">
						Search
					</Link>
				</li>
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
		<footer className="bg-stone-900 text-white">
			{/* Newsletter bar */}
			<div className="border-b border-white/10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
						<div>
							<h3 className="font-heading text-lg font-semibold tracking-wide">Sign up and save</h3>
							<p className="mt-1 text-sm text-white/60">
								Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
							</p>
						</div>
						<NewsletterForm />
					</div>
				</div>
			</div>

			{/* Main footer */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Brand */}
					<div>
						<Link href="/" className="font-heading text-lg font-semibold tracking-wider uppercase text-white">
							Your Next Store
						</Link>
						<p className="mt-4 text-sm text-white/60 leading-relaxed">
							Adventure apparel for the modern explorer. Durable, sustainable, made with care.
						</p>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Support */}
					<div>
						<h3 className="font-heading text-sm font-semibold tracking-widest uppercase text-white mb-4">
							Support
						</h3>
						<ul className="space-y-3">
							<li>
								<Link href="/about" className="text-sm text-white/60 hover:text-white transition-colors">
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link href="/faq" className="text-sm text-white/60 hover:text-white transition-colors">
									FAQ
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					{/* About / Legal */}
					<FooterLegalPages />

					{/* Pickup info */}
					<div>
						<h3 className="font-heading text-sm font-semibold tracking-widest uppercase text-white mb-4">
							Local pickup available
						</h3>
						<div className="text-sm text-white/60 space-y-1">
							<p>301 Front St W</p>
							<p>Toronto, Canada</p>
							<p className="pt-2">Mon - Fri, 8:30am - 10:30pm</p>
							<p>Saturday, 8:30am - 10:30pm</p>
							<p>Sunday, 8:30am - 10:30pm</p>
						</div>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-white/10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-xs text-white/40">&copy; {year} Your Next Store. All rights reserved.</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
