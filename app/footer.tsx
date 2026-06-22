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
			<Link href="/blog" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors font-light">
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
				className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors font-light"
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
			<p className="text-xs tracking-[0.2em] uppercase text-zinc-400 mb-6">Collections</p>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors font-light"
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
			<p className="text-xs tracking-[0.2em] uppercase text-zinc-400 mb-6">Legal</p>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors font-light"
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
		<footer className="bg-[#FAFAF8]">
			{/* Top border */}
			<div className="h-px w-full bg-zinc-200" />

			<div className="max-w-7xl mx-auto px-8 lg:px-16">
				{/* Main footer content */}
				<div className="py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-16">
					{/* Brand section */}
					<div className="lg:col-span-5">
						<Link href="/" className="text-xs tracking-[0.3em] uppercase text-zinc-900">
							Your Next Store
						</Link>
						<p className="mt-8 text-sm text-zinc-500 leading-relaxed font-light max-w-sm">
							Curated essentials for modern living. Quality products, thoughtfully designed.
						</p>
					</div>

					{/* Navigation columns */}
					<div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12">
						<FooterCollections />

						<div>
							<p className="text-xs tracking-[0.2em] uppercase text-zinc-400 mb-6">Information</p>
							<ul className="space-y-3">
								<li>
									<Link
										href="/about"
										className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors font-light"
									>
										About
									</Link>
								</li>
								<FooterContactLink />
								<li>
									<Link
										href="/shipping"
										className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors font-light"
									>
										Shipping
									</Link>
								</li>
								<FooterBlogLink />
							</ul>
						</div>

						<FooterLegalPages />
					</div>
				</div>

				{/* Bottom bar */}
				<div className="h-px w-full bg-zinc-200" />
				<div className="py-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<p className="text-xs text-zinc-400 tracking-wide">{year} Your Next Store</p>
					<p className="text-xs text-zinc-400 tracking-wide">All rights reserved</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
