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
				className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
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
				className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
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
			<h3 className="text-xs font-normal tracking-[0.2em] uppercase text-primary-foreground mb-6">
				Collections
			</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
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
			<h3 className="text-xs font-normal tracking-[0.2em] uppercase text-primary-foreground mb-6">Info</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
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
		<footer className="bg-foreground text-primary-foreground">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
					{/* About */}
					<div>
						<h3 className="text-xs font-normal tracking-[0.2em] uppercase text-primary-foreground mb-6">
							About
						</h3>
						<p className="text-sm text-primary-foreground/60 leading-relaxed">
							Simple, beautiful objects that combine form and function. Curated essentials for modern living.
						</p>
					</div>

					{/* Info */}
					<FooterLegalPages />

					{/* Collections */}
					<FooterCollections />

					{/* Newsletter */}
					<div>
						<h3 className="text-xs font-normal tracking-[0.2em] uppercase text-primary-foreground mb-6">
							Newsletter
						</h3>
						<p className="text-sm text-primary-foreground/60 leading-relaxed">
							Stay up to date on the latest product releases and special offers.
						</p>
						<ul className="mt-6 space-y-3">
							<li>
								<Link
									href="/about"
									className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
								>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link
									href="/faq"
									className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
								>
									FAQ
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-primary-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-xs text-primary-foreground/40">
						&copy; {year} Your Next Store. All rights reserved.
					</p>
					<PaymentMethods />
					<Link
						href="/"
						className="font-heading text-lg font-light tracking-[0.15em] uppercase text-primary-foreground"
					>
						YNS
					</Link>
				</div>
			</div>
		</footer>
	);
}
