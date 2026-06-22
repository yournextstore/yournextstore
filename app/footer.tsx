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
			<Link href="/blog" className="text-sm text-cream/80 transition-colors hover:text-cream">
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
			<Link href="/contact" className="text-sm text-cream/80 transition-colors hover:text-cream">
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
			<h3 className="eyebrow text-cream/60">Shop</h3>
			<ul className="mt-6 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-cream/80 transition-colors hover:text-cream"
						>
							{collection.name}
						</Link>
					</li>
				))}
				<li>
					<Link href="/products" className="text-sm text-cream/80 transition-colors hover:text-cream">
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

	if (pages.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="eyebrow text-cream/60">Legal</h3>
			<ul className="mt-6 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-cream/80 transition-colors hover:text-cream"
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
		<footer className="bg-ink text-cream">
			<div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
				<div className="grid grid-cols-1 gap-12 py-16 sm:py-20 md:grid-cols-12">
					{/* Brand */}
					<div className="md:col-span-4">
						<Link href="/" className="font-display text-2xl tracking-[0.32em] text-cream">
							YOUR NEXT STORE
						</Link>
						<p className="mt-6 max-w-xs text-sm leading-relaxed text-cream/60">
							Performance beauty engineered for the way you actually live. Sweat-proof, transfer-resistant,
							unapologetically you.
						</p>
						<div className="mt-8 flex items-center gap-4 text-cream/60">
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-cream"
							>
								<span className="eyebrow">Instagram</span>
							</a>
							<span className="text-cream/30">·</span>
							<a
								href="https://tiktok.com"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-cream"
							>
								<span className="eyebrow">TikTok</span>
							</a>
							<span className="text-cream/30">·</span>
							<a
								href="https://youtube.com"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-cream"
							>
								<span className="eyebrow">YouTube</span>
							</a>
						</div>
					</div>

					{/* Columns */}
					<div className="md:col-span-2">
						<FooterCollections />
					</div>

					<div className="md:col-span-2">
						<h3 className="eyebrow text-cream/60">Support</h3>
						<ul className="mt-6 space-y-3">
							<li>
								<Link href="/about" className="text-sm text-cream/80 transition-colors hover:text-cream">
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link href="/faq" className="text-sm text-cream/80 transition-colors hover:text-cream">
									FAQ
								</Link>
							</li>
							<li>
								<a
									href="mailto:hello@yournextstore.com"
									className="text-sm text-cream/80 transition-colors hover:text-cream"
								>
									Contact
								</a>
							</li>
							<li>
								<Link href="/products" className="text-sm text-cream/80 transition-colors hover:text-cream">
									Shipping
								</Link>
							</li>
							<li>
								<Link href="/products" className="text-sm text-cream/80 transition-colors hover:text-cream">
									Returns
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<div className="md:col-span-2">
						<FooterLegalPages />
					</div>

					<div className="md:col-span-2">
						<h3 className="eyebrow text-cream/60">Studio</h3>
						<ul className="mt-6 space-y-3">
							<li>
								<Link href="#about" className="text-sm text-cream/80 hover:text-cream">
									About
								</Link>
							</li>
							<li>
								<Link href="#impact" className="text-sm text-cream/80 hover:text-cream">
									Impact
								</Link>
							</li>
							<li>
								<Link href="/products" className="text-sm text-cream/80 hover:text-cream">
									Press
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="flex flex-col items-start justify-between gap-4 border-t border-cream/15 py-6 text-xs text-cream/45 sm:flex-row sm:items-center">
					<p>&copy; {year} Your Next Store. All rights reserved.</p>
					<div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
						<p className="eyebrow">Made with intention · Brooklyn / Paris</p>
						<PaymentMethods />
					</div>
				</div>
			</div>
		</footer>
	);
}
