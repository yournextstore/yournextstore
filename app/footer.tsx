import { cacheLife } from "next/cache";
import { YnsLink } from "@/components/yns-link";
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
			<YnsLink
				prefetch={"eager"}
				href="/blog"
				className="text-sm text-[var(--cream)]/85 hover:text-[var(--olive)] transition-colors"
			>
				Blog
			</YnsLink>
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
			<YnsLink
				prefetch={"eager"}
				href="/contact"
				className="text-sm text-[var(--cream)]/85 hover:text-[var(--olive)] transition-colors"
			>
				Contact Us
			</YnsLink>
		</li>
	);
}

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	if (collections.data.length === 0) {
		return (
			<div>
				<h3 className="text-[10px] tracking-[0.32em] uppercase text-[var(--cream)]/60 mb-5">Shop</h3>
				<ul className="space-y-3">
					<li>
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="text-sm text-[var(--cream)]/85 hover:text-[var(--olive)] transition-colors"
						>
							All products
						</YnsLink>
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
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="text-sm text-[var(--cream)]/85 hover:text-[var(--olive)] transition-colors"
					>
						All products
					</YnsLink>
				</li>
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-[var(--cream)]/85 hover:text-[var(--olive)] transition-colors"
						>
							{collection.name}
						</YnsLink>
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
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-[var(--cream)]/85 hover:text-[var(--olive)] transition-colors"
						>
							{page.label}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

function PaymentIcon({ label }: { label: string }) {
	return (
		<span className="inline-flex h-6 px-2.5 items-center justify-center rounded-sm bg-[var(--cream)]/10 text-[10px] tracking-[0.16em] uppercase text-[var(--cream)]/80">
			{label}
		</span>
	);
}

export function Footer() {
	return (
		<footer className="bg-[var(--olive-dark)] text-[var(--cream)]">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
				<div className="py-16 lg:py-24 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 lg:gap-16">
					{/* Brand */}
					<div className="col-span-2 lg:col-span-2 max-w-sm">
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-display text-3xl lg:text-4xl text-[var(--cream)] leading-none"
						>
							Your Next Store
						</YnsLink>
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
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-[var(--cream)]/85 hover:text-[var(--olive)] transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-[var(--cream)]/85 hover:text-[var(--olive)] transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-[var(--cream)]/85 hover:text-[var(--olive)] transition-colors"
								>
									Instructions
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/cart"
									className="text-sm text-[var(--cream)]/85 hover:text-[var(--olive)] transition-colors"
								>
									Shipping & returns
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/cart"
									className="text-sm text-[var(--cream)]/85 hover:text-[var(--olive)] transition-colors"
								>
									Contact
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					{/* Legal */}
					<FooterLegalPages />
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-[var(--cream)]/15 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					<div className="flex flex-wrap items-center gap-2">
						<PaymentIcon label="Visa" />
						<PaymentIcon label="Mastercard" />
						<PaymentIcon label="Amex" />
						<PaymentIcon label="Apple Pay" />
						<PaymentIcon label="Klarna" />
					</div>
					<p className="text-[10px] tracking-[0.22em] uppercase text-[var(--cream)]/55">
						© {new Date().getFullYear()} Your Next Store — Designed in Denmark.
					</p>
				</div>
			</div>
		</footer>
	);
}
