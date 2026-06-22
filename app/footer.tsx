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
				className="text-sm text-[var(--cream)]/85 hover:text-[var(--cream)] transition-colors"
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
				className="text-sm text-[var(--cream)]/85 hover:text-[var(--cream)] transition-colors"
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
		return null;
	}

	return (
		<div>
			<h3 className="text-[11px] tracking-[0.22em] uppercase text-[var(--cream)]/60 mb-5">Shop</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-[var(--cream)]/85 hover:text-[var(--cream)] transition-colors"
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
			<h3 className="text-[11px] tracking-[0.22em] uppercase text-[var(--cream)]/60 mb-5">Legal</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-[var(--cream)]/85 hover:text-[var(--cream)] transition-colors"
						>
							{page.label}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

export function Footer() {
	return (
		<footer className="relative bg-[var(--olive-deep)] text-[var(--cream)] mt-0">
			{/* Decorative top arch */}
			<svg
				aria-hidden="true"
				className="absolute -top-px left-0 right-0 w-full h-8 text-[var(--olive-deep)]"
				viewBox="0 0 1200 40"
				preserveAspectRatio="none"
			>
				<path d="M 0 40 L 0 30 Q 600 -10, 1200 30 L 1200 40 Z" fill="currentColor" />
			</svg>

			<div className="relative max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
				{/* Top oversized wordmark */}
				<div className="pt-20 pb-12 border-b border-[var(--cream)]/15">
					<p className="text-[11px] tracking-[0.3em] uppercase text-[var(--cream)]/50 mb-4">
						Your Next Store
					</p>
					<h2 className="font-display text-[clamp(3.5rem,12vw,11rem)] leading-[0.9] tracking-tight text-[var(--cream)]">
						Slow goods,
						<br />
						<em className="italic font-light text-[var(--clay)]">honestly made.</em>
					</h2>
				</div>

				<div className="py-16 grid grid-cols-2 lg:grid-cols-5 gap-10">
					{/* Brand */}
					<div className="col-span-2 max-w-sm">
						<div className="flex items-center gap-2 mb-5">
							<svg
								viewBox="0 0 32 32"
								className="h-7 w-7 text-[var(--clay)]"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.6"
								aria-hidden="true"
							>
								<path d="M16 4 C 9 9, 6 16, 16 28 C 26 16, 23 9, 16 4 Z" strokeLinejoin="round" />
								<path d="M16 4 L 16 28" strokeLinecap="round" />
							</svg>
							<span className="font-display text-2xl">Your Next Store</span>
						</div>
						<p className="text-sm text-[var(--cream)]/70 leading-relaxed">
							A small atelier of slow goods — for skin, for home, for ceremony. Made by hand, made to last.
						</p>
						<div className="mt-6 flex gap-2">
							{["Instagram", "Pinterest", "Substack"].map((s) => (
								<a
									key={s}
									href={`https://example.com/${s.toLowerCase()}`}
									className="text-xs tracking-[0.18em] uppercase border border-[var(--cream)]/20 rounded-full px-3 py-1.5 hover:bg-[var(--cream)] hover:text-[var(--olive-deep)] transition-colors"
								>
									{s}
								</a>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-[11px] tracking-[0.22em] uppercase text-[var(--cream)]/60 mb-5">Support</h3>
						<ul className="space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-[var(--cream)]/85 hover:text-[var(--cream)] transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-[var(--cream)]/85 hover:text-[var(--cream)] transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-[var(--cream)]/85 hover:text-[var(--cream)] transition-colors"
								>
									Shipping & Returns
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-[var(--cream)]/85 hover:text-[var(--cream)] transition-colors"
								>
									Refill Programme
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="py-8 border-t border-[var(--cream)]/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[11px] tracking-[0.18em] uppercase text-[var(--cream)]/50">
					<p>&copy; {new Date().getFullYear()} Your Next Store · Crafted slowly</p>
					<p>Carbon-neutral shipping · 1% for the Planet · B-Corp pending</p>
				</div>
			</div>
		</footer>
	);
}
