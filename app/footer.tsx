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
				className="text-sm text-[var(--color-cream)]/70 hover:text-[var(--color-blush)] transition-colors"
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
				className="text-sm text-[var(--color-cream)]/70 hover:text-[var(--color-blush)] transition-colors"
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
			<h3
				className="font-heading text-base text-[var(--color-cream)]"
				style={{ fontVariationSettings: "'SOFT' 100" }}
			>
				Collections
			</h3>
			<ul className="mt-4 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-[var(--color-cream)]/70 hover:text-[var(--color-blush)] transition-colors"
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
			<h3
				className="font-heading text-base text-[var(--color-cream)]"
				style={{ fontVariationSettings: "'SOFT' 100" }}
			>
				Legal
			</h3>
			<ul className="mt-4 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-[var(--color-cream)]/70 hover:text-[var(--color-blush)] transition-colors"
						>
							{page.label}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

const SOCIAL_ICONS = [
	{
		label: "Instagram",
		href: "https://instagram.com",
		path: "M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10zm-5 3a5 5 0 1 0 .001 10.001A5 5 0 0 0 12 7zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm5.25-.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5z",
	},
	{
		label: "TikTok",
		href: "https://tiktok.com",
		path: "M14 3v8.5a3 3 0 1 1-3-3v2.2a.9.9 0 1 0 .9.9V3h2.4c.2 1.6 1.4 2.9 3 3.2V8.6a5.4 5.4 0 0 1-3.3-1.2V3H14z",
	},
	{
		label: "Pinterest",
		href: "https://pinterest.com",
		path: "M12 2a10 10 0 0 0-3.7 19.3c-.1-.8-.2-2 0-2.9l1.3-5.4s-.3-.6-.3-1.6c0-1.5.9-2.6 2-2.6.9 0 1.4.7 1.4 1.5 0 .9-.6 2.3-.9 3.6-.3 1.1.5 2 1.6 2 1.9 0 3.4-2 3.4-5 0-2.6-1.9-4.4-4.5-4.4-3.1 0-4.9 2.3-4.9 4.7 0 .9.4 1.9.8 2.5l-.3 1.3c-.1.2-.2.3-.4.2-1.4-.6-2.2-2.6-2.2-4.2 0-3.4 2.5-6.6 7.2-6.6 3.8 0 6.7 2.7 6.7 6.3 0 3.8-2.4 6.8-5.7 6.8-1.1 0-2.2-.6-2.5-1.3l-.7 2.6c-.3 1-.9 2.2-1.4 2.9A10 10 0 1 0 12 2z",
	},
];

const PAYMENT_BADGES = ["Visa", "Mastercard", "AmEx", "PayPal", "Apple Pay", "Klarna"];

export function Footer() {
	return (
		<footer className="bg-[var(--color-ink)] text-[var(--color-cream)] relative overflow-hidden">
			<div
				className="dotty-divider absolute inset-x-0 top-0 h-3 text-[var(--color-blush)]/30"
				aria-hidden="true"
			/>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-14 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
					<div className="md:col-span-4">
						<YnsLink prefetch={"eager"} href="/" className="inline-flex items-center gap-2">
							<svg width="30" height="30" viewBox="0 0 64 64" aria-hidden="true">
								<title>YNS mascot</title>
								<ellipse cx="32" cy="40" rx="20" ry="18" fill="#7bc4c9" opacity="0.35" />
								<circle cx="32" cy="34" r="16" fill="#fdf7f1" />
								<ellipse cx="22" cy="15" rx="4.2" ry="9" fill="#fdf7f1" />
								<ellipse cx="42" cy="15" rx="4.2" ry="9" fill="#fdf7f1" />
								<circle cx="26" cy="32" r="2" fill="#1f2a30" />
								<circle cx="38" cy="32" r="2" fill="#1f2a30" />
								<path
									d="M28 38c1.5 1.5 6.5 1.5 8 0"
									stroke="#1f2a30"
									strokeWidth="1.6"
									strokeLinecap="round"
									fill="none"
								/>
							</svg>
							<span
								className="font-heading text-2xl text-[var(--color-cream)]"
								style={{ fontVariationSettings: "'SOFT' 100" }}
							>
								Your Next Store
							</span>
						</YnsLink>
						<p className="mt-4 text-sm text-[var(--color-cream)]/70 leading-relaxed max-w-sm">
							Cuddly characters &amp; playful gifts, stitched with care in our London studio since 2024.
						</p>
						<div className="mt-6 flex items-center gap-2">
							{SOCIAL_ICONS.map((s) => (
								<a
									key={s.label}
									href={s.href}
									className="h-10 w-10 rounded-full bg-[var(--color-cream)]/10 hover:bg-[var(--color-blush)] hover:text-[var(--color-ink)] text-[var(--color-cream)] inline-flex items-center justify-center transition-colors"
								>
									<span className="sr-only">{s.label}</span>
									<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
										<title>{s.label}</title>
										<path d={s.path} />
									</svg>
								</a>
							))}
						</div>
					</div>
					<div className="md:col-span-2">
						<FooterCollections />
					</div>
					<div className="md:col-span-2">
						<h3
							className="font-heading text-base text-[var(--color-cream)]"
							style={{ fontVariationSettings: "'SOFT' 100" }}
						>
							Help
						</h3>
						<ul className="mt-4 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-[var(--color-cream)]/70 hover:text-[var(--color-blush)] transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-[var(--color-cream)]/70 hover:text-[var(--color-blush)] transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<FooterBlogLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-[var(--color-cream)]/70 hover:text-[var(--color-blush)] transition-colors"
								>
									Shipping &amp; returns
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-[var(--color-cream)]/70 hover:text-[var(--color-blush)] transition-colors"
								>
									Plush care
								</YnsLink>
							</li>
						</ul>
					</div>
					<div className="md:col-span-2">
						<FooterLegalPages />
					</div>
					<div className="md:col-span-2">
						<h3
							className="font-heading text-base text-[var(--color-cream)]"
							style={{ fontVariationSettings: "'SOFT' 100" }}
						>
							About
						</h3>
						<ul className="mt-4 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/"
									className="text-sm text-[var(--color-cream)]/70 hover:text-[var(--color-blush)] transition-colors"
								>
									Our story
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/newsletter"
									className="text-sm text-[var(--color-cream)]/70 hover:text-[var(--color-blush)] transition-colors"
								>
									The YNS Post
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-[var(--color-cream)]/70 hover:text-[var(--color-blush)] transition-colors"
								>
									Stockists
								</YnsLink>
							</li>
						</ul>
					</div>
				</div>

				<div className="py-6 border-t border-[var(--color-cream)]/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
					<p className="text-xs text-[var(--color-cream)]/60">
						&copy; {new Date().getFullYear()} Your Next Store. Hand-stitched with love in London.
					</p>
					<div className="flex flex-wrap items-center gap-2">
						{PAYMENT_BADGES.map((p) => (
							<span
								key={p}
								className="inline-flex items-center justify-center h-7 px-3 rounded-md bg-[var(--color-cream)]/10 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-cream)]/80"
							>
								{p}
							</span>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}
