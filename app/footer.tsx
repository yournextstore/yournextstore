import { cacheLife } from "next/cache";
import Link from "next/link";
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
				className="text-sm text-white/60 hover:text-brand transition-colors"
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
				className="text-sm text-white/60 hover:text-brand transition-colors"
			>
				Contact Us
			</Link>
		</li>
	);
}

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">Collections</h3>
			<ul className="mt-4 space-y-2">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-white/60 hover:text-brand transition-colors"
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
			<h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">Legal</h3>
			<ul className="mt-4 space-y-2">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-white/60 hover:text-brand transition-colors"
						>
							{page.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

export function Footer() {
	return (
		<footer className="bg-[#1a1a1a] text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Brand */}
					<div>
						<Link
							href="/"
							className="font-heading text-xl font-bold text-white uppercase tracking-wider"
						>
							Your Next Store
						</Link>
						<p className="mt-4 text-sm text-white/60 leading-relaxed">
							Premium automotive parts and accessories. Quality products for every vehicle, engineered for
							performance.
						</p>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Support */}
					<div>
						<h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">Support</h3>
						<ul className="mt-4 space-y-2">
							<li>
								<Link
									href="/about"
									className="text-sm text-white/60 hover:text-brand transition-colors"
								>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link
									href="/faq"
									className="text-sm text-white/60 hover:text-brand transition-colors"
								>
									FAQ
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					{/* Legal */}
					<FooterLegalPages />

					{/* Customer Service */}
					<div>
						<h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
							Customer Service
						</h3>
						<ul className="mt-4 space-y-2">
							<li>
								<Link
									href="/products"
									className="text-sm text-white/60 hover:text-brand transition-colors"
								>
									Contact Us
								</Link>
							</li>
							<li>
								<Link
									href="/products"
									className="text-sm text-white/60 hover:text-brand transition-colors"
								>
									Shipping &amp; Delivery
								</Link>
							</li>
							<li>
								<Link
									href="/products"
									className="text-sm text-white/60 hover:text-brand transition-colors"
								>
									Returns &amp; Exchanges
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-white/10">
					<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
						<p className="text-sm text-white/40">
							&copy; {new Date().getFullYear()} Your Next Store. All rights reserved.
						</p>
						<div className="flex items-center gap-4">
							<span className="text-xs text-white/40 uppercase tracking-wide">
								Helpline: (+800) 123 456 7890
							</span>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
