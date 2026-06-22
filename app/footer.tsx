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
				className="text-sm text-[var(--cream)]/85 hover:text-[var(--olive)] transition-colors"
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
				className="text-sm text-[var(--cream)]/85 hover:text-[var(--olive)] transition-colors"
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
		return (
			<div>
				<h3 className="text-[10px] tracking-[0.32em] uppercase text-[var(--cream)]/60 mb-5">Shop</h3>
				<ul className="space-y-3">
					<li>
						<Link
							href="/products"
							className="text-sm text-[var(--cream)]/85 hover:text-[var(--olive)] transition-colors"
						>
							All products
						</Link>
					</li>
				</ul>
			</div>
		);
	}

	return (
		<div>
			<h3 className="text-[10px] tracking-[0.32em] uppercase text-[var(--cream)]/60 mb-5">Shop</h3>
			<ul className="space-y-3">
				<li>
					<Link
						href="/products"
						className="text-sm text-[var(--cream)]/85 hover:text-[var(--olive)] transition-colors"
					>
						All products
					</Link>
				</li>
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-[var(--cream)]/85 hover:text-[var(--olive)] transition-colors"
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
			<h3 className="text-[10px] tracking-[0.32em] uppercase text-[var(--cream)]/60 mb-5">Legal</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-[var(--cream)]/85 hover:text-[var(--olive)] transition-colors"
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
		<footer className="bg-[var(--olive-dark)] text-[var(--cream)]">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
				<div className="py-16 lg:py-24 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 lg:gap-16">
					{/* Brand */}
					<div className="col-span-2 lg:col-span-2 max-w-sm">
						<Link href="/" className="font-display text-3xl lg:text-4xl text-[var(--cream)] leading-none">
							Your Next Store
						</Link>
						<p className="mt-5 text-sm text-[var(--cream)]/70 leading-relaxed">
							A new era of nurturing. Quiet objects, considered design, and slow rituals — shipped from our
							studio to your home.
						</p>
						<div className="mt-8 flex items-center gap-3">
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noreferrer"
								className="text-[10px] tracking-[0.28em] uppercase text-[var(--cream)]/80 hover:text-[var(--olive)] transition-colors"
							>
								Instagram
							</a>
							<span className="text-[var(--cream)]/30">·</span>
							<a
								href="https://pinterest.com"
								target="_blank"
								rel="noreferrer"
								className="text-[10px] tracking-[0.28em] uppercase text-[var(--cream)]/80 hover:text-[var(--olive)] transition-colors"
							>
								Pinterest
							</a>
							<span className="text-[var(--cream)]/30">·</span>
							<a
								href="https://tiktok.com"
								target="_blank"
								rel="noreferrer"
								className="text-[10px] tracking-[0.28em] uppercase text-[var(--cream)]/80 hover:text-[var(--olive)] transition-colors"
							>
								TikTok
							</a>
						</div>
					</div>

					{/* Shop */}
					<FooterCollections />

					{/* Support */}
					<div>
						<h3 className="text-[10px] tracking-[0.32em] uppercase text-[var(--cream)]/60 mb-5">Support</h3>
						<ul className="space-y-3">
							<li>
								<Link
									href="/about"
									className="text-sm text-[var(--cream)]/85 hover:text-[var(--olive)] transition-colors"
								>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link
									href="/faq"
									className="text-sm text-[var(--cream)]/85 hover:text-[var(--olive)] transition-colors"
								>
									FAQ
								</Link>
							</li>
							<li>
								<Link
									href="/faq"
									className="text-sm text-[var(--cream)]/85 hover:text-[var(--olive)] transition-colors"
								>
									Instructions
								</Link>
							</li>
							<li>
								<Link
									href="/cart"
									className="text-sm text-[var(--cream)]/85 hover:text-[var(--olive)] transition-colors"
								>
									Shipping & returns
								</Link>
							</li>
							<li>
								<Link
									href="/cart"
									className="text-sm text-[var(--cream)]/85 hover:text-[var(--olive)] transition-colors"
								>
									Contact
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					{/* Legal */}
					<FooterLegalPages />
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-[var(--cream)]/15 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					{/* Official marks on a cream chip: they are full-colour logos and would vanish on the olive footer. */}
					<div className="rounded-sm bg-[var(--cream)] px-2.5 py-1.5 w-fit">
						<PaymentMethods />
					</div>
					<p className="text-[10px] tracking-[0.22em] uppercase text-[var(--cream)]/55">
						© {year} Your Next Store — Designed in Denmark.
					</p>
				</div>
			</div>
		</footer>
	);
}
