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
				className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
				className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
			<h3 className="text-[11px] uppercase tracking-[0.22em] font-medium text-foreground">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
			<h3 className="text-[11px] uppercase tracking-[0.22em] font-medium text-foreground">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
		<footer className="bg-background border-t border-border">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-12">
					{/* Brand */}
					<div className="col-span-2 sm:col-span-3 lg:col-span-2 lg:max-w-sm">
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-display text-3xl font-light tracking-[0.04em] text-foreground"
						>
							Your Next Store
						</YnsLink>
						<p className="mt-5 text-sm text-muted-foreground leading-relaxed">
							Editorial luxury, considered design. A small atelier of pieces sourced from European houses and
							made to last.
						</p>
						<div className="mt-6 flex items-center gap-3 text-muted-foreground">
							<button
								type="button"
								aria-label="Instagram"
								className="hover:text-foreground transition-colors"
							>
								<span className="sr-only">Instagram</span>
								<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
									<rect x="2" y="2" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="1.2" />
									<circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.2" />
									<circle cx="13.5" cy="4.5" r="0.6" fill="currentColor" />
								</svg>
							</button>
							<button
								type="button"
								aria-label="Pinterest"
								className="hover:text-foreground transition-colors"
							>
								<span className="sr-only">Pinterest</span>
								<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
									<circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.2" />
									<path
										d="M9 5v8M9 5a2 2 0 0 1 0 4M7 17l2-6"
										stroke="currentColor"
										strokeWidth="1.2"
										strokeLinecap="round"
									/>
								</svg>
							</button>
							<button type="button" aria-label="TikTok" className="hover:text-foreground transition-colors">
								<span className="sr-only">TikTok</span>
								<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
									<path
										d="M11 2v9a3 3 0 1 1-3-3"
										stroke="currentColor"
										strokeWidth="1.2"
										strokeLinecap="round"
									/>
									<path
										d="M11 2c.5 2 2 3 4 3"
										stroke="currentColor"
										strokeWidth="1.2"
										strokeLinecap="round"
									/>
								</svg>
							</button>
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-[11px] uppercase tracking-[0.22em] font-medium text-foreground">Support</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									Shipping
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									Returns
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									Size Guide
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="mt-16 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
						&copy; {new Date().getFullYear()} Your Next Store
					</p>
					<p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
						Made with care in Lisbon, Milan &amp; Paris
					</p>
				</div>
			</div>
		</footer>
	);
}
