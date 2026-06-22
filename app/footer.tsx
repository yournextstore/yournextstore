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
				className="text-sm text-muted-foreground hover:text-ink transition-colors"
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
				className="text-sm text-muted-foreground hover:text-ink transition-colors"
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
			<h3 className="text-[11px] tracking-[0.24em] uppercase text-ink mb-5">Shop</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch="eager"
							href={`/collection/${collection.slug}`}
							className="text-sm text-muted-foreground hover:text-ink transition-colors"
						>
							{collection.name}
						</YnsLink>
					</li>
				))}
				<li>
					<YnsLink
						prefetch="eager"
						href="/products"
						className="text-sm text-muted-foreground hover:text-ink transition-colors"
					>
						All Products
					</YnsLink>
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
			<h3 className="text-[11px] tracking-[0.24em] uppercase text-ink mb-5">About</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch="eager"
							href={`/legal${page.href}`}
							className="text-sm text-muted-foreground hover:text-ink transition-colors"
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
		<footer className="bg-cream text-ink border-t border-border">
			<div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
				<div className="py-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10 sm:gap-12">
					{/* Brand */}
					<div className="col-span-2 lg:col-span-2 sm:max-w-sm">
						<YnsLink prefetch="eager" href="/" className="font-serif text-2xl tracking-[0.16em] text-ink">
							YOUR&nbsp;NEXT&nbsp;STORE
						</YnsLink>
						<p className="mt-5 text-sm text-muted-foreground leading-relaxed max-w-xs font-light">
							Boho-inspired dresses and easy separates, designed in our studio and made to wander far.
						</p>
						<div className="mt-6 flex items-center gap-3 text-ink/70">
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Instagram"
								className="h-9 w-9 flex items-center justify-center border border-ink/20 rounded-full hover:bg-ink hover:text-cream hover:border-ink transition-colors"
							>
								<svg
									className="h-4 w-4"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
								>
									<rect x="3" y="3" width="18" height="18" rx="5" />
									<circle cx="12" cy="12" r="4" />
									<circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
								</svg>
							</a>
							<a
								href="https://pinterest.com"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Pinterest"
								className="h-9 w-9 flex items-center justify-center border border-ink/20 rounded-full hover:bg-ink hover:text-cream hover:border-ink transition-colors"
							>
								<svg
									className="h-4 w-4"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
								>
									<circle cx="12" cy="12" r="9" />
									<path d="M12 7v10M10 14l2 3 2-5" />
								</svg>
							</a>
							<a
								href="https://facebook.com"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Facebook"
								className="h-9 w-9 flex items-center justify-center border border-ink/20 rounded-full hover:bg-ink hover:text-cream hover:border-ink transition-colors"
							>
								<svg
									className="h-4 w-4"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
								>
									<path d="M15 3h-3a4 4 0 0 0-4 4v3H5v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
								</svg>
							</a>
						</div>
					</div>

					{/* Shop */}
					<FooterCollections />

					{/* Help */}
					<div>
						<h3 className="text-[11px] tracking-[0.24em] uppercase text-ink mb-5">Help</h3>
						<ul className="space-y-3">
							<li>
								<YnsLink
									prefetch="eager"
									href="/about"
									className="text-sm text-muted-foreground hover:text-ink transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch="eager"
									href="/faq"
									className="text-sm text-muted-foreground hover:text-ink transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch="eager"
									href="/faq"
									className="text-sm text-muted-foreground hover:text-ink transition-colors"
								>
									Shipping &amp; Returns
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch="eager"
									href="/faq"
									className="text-sm text-muted-foreground hover:text-ink transition-colors"
								>
									Size Guide
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch="eager"
									href="/faq"
									className="text-sm text-muted-foreground hover:text-ink transition-colors"
								>
									Contact Us
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					{/* About */}
					<FooterLegalPages />
				</div>

				<div className="border-t border-ink/15 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-xs text-muted-foreground tracking-wide">
						&copy; {new Date().getFullYear()} Your Next Store. Crafted with care.
					</p>
					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						<span className="inline-block h-3 w-4 rounded-[1px] overflow-hidden relative border border-ink/20">
							<span className="absolute inset-0 bg-[#bf0a30]" />
							<span className="absolute inset-x-0 top-0 h-1.5 bg-white" />
							<span className="absolute inset-x-0 top-0 h-[3px] bg-[#002868]" />
						</span>
						<span className="tracking-[0.18em] uppercase">USA (USD)</span>
					</div>
				</div>
			</div>
		</footer>
	);
}
