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
			<h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-foreground">Shop</h3>
			<ul className="mt-5 space-y-3">
				<li>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="text-sm text-muted-foreground hover:text-foreground transition-colors"
					>
						All products
					</YnsLink>
				</li>
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
			<h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-foreground">Company</h3>
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
		<footer className="bg-[var(--color-sky)]/35 text-[var(--color-navy)]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-12">
					{/* Brand */}
					<div className="col-span-2 lg:col-span-2 lg:max-w-sm">
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-display text-2xl font-extrabold tracking-[0.16em] uppercase text-foreground"
						>
							Your Next Store
						</YnsLink>
						<p className="mt-4 text-sm text-foreground/75 leading-relaxed">
							Top-tasting toothpaste, crafted by world-class flavor houses. A confident challenger to oral
							care that finally feels like a treat.
						</p>
						<div className="mt-6 flex items-center gap-3">
							<a
								href="https://instagram.com"
								className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[var(--color-navy)] hover:bg-white/80 transition"
							>
								<span className="sr-only">Instagram</span>
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									className="h-4 w-4"
									aria-hidden
								>
									<rect x="3" y="3" width="18" height="18" rx="5" />
									<circle cx="12" cy="12" r="4" />
									<circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
								</svg>
							</a>
							<a
								href="https://twitter.com"
								className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[var(--color-navy)] hover:bg-white/80 transition"
							>
								<span className="sr-only">Twitter</span>
								<svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
									<path d="M18.244 2H21l-6.52 7.45L22 22h-6.79l-4.74-6.2L4.8 22H2l7-7.99L1.5 2H8.4l4.29 5.67L18.24 2Zm-1.18 18.34h1.62L6.95 3.55H5.21l11.85 16.79Z" />
								</svg>
							</a>
							<a
								href="https://youtube.com"
								className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[var(--color-navy)] hover:bg-white/80 transition"
							>
								<span className="sr-only">YouTube</span>
								<svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
									<path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.27 5 12 5 12 5s-6.27 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26.3 26.3 0 0 0 2 12a26.3 26.3 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.73 19 12 19 12 19s6.27 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26.3 26.3 0 0 0 22 12a26.3 26.3 0 0 0-.4-4.8ZM10 15V9l5.2 3-5.2 3Z" />
								</svg>
							</a>
						</div>
					</div>

					<FooterCollections />

					{/* Support */}
					<div>
						<h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-foreground">Support</h3>
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
							<FooterBlogLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/cart"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									Track your order
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									Subscription help
								</YnsLink>
							</li>
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				{/* Giant wordmark */}
				<div aria-hidden className="overflow-hidden border-t border-foreground/10 py-10 sm:py-14">
					<p className="font-display text-[16vw] sm:text-[14vw] lg:text-[12rem] leading-none font-extrabold tracking-[-0.04em] text-foreground/85 whitespace-nowrap text-center">
						YOUR · NEXT · STORE
					</p>
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-foreground/10 flex flex-col sm:flex-row gap-3 items-center justify-between">
					<p className="text-xs uppercase tracking-[0.16em] text-foreground/60">
						&copy; {new Date().getFullYear()} Your Next Store — All rights reserved
					</p>
					<p className="text-xs uppercase tracking-[0.16em] text-foreground/60">Made with sparkle in SLC</p>
				</div>
			</div>
		</footer>
	);
}
