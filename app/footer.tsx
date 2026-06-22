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
				className="text-sm text-cream/55 hover:text-apricot transition-colors"
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
				className="text-sm text-cream/55 hover:text-apricot transition-colors"
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
			<h3 className="text-[11px] uppercase tracking-[0.28em] font-medium text-cream/90 mb-5">Shop</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-cream/55 hover:text-apricot transition-colors"
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
			<h3 className="text-[11px] uppercase tracking-[0.28em] font-medium text-cream/90 mb-5">Fine Print</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-cream/55 hover:text-apricot transition-colors"
						>
							{page.label}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

function SocialIcon({ label, path }: { label: string; path: string }) {
	return (
		<a
			href="#"
			aria-label={label}
			className="h-9 w-9 rounded-full border border-cream/20 flex items-center justify-center text-cream/70 hover:text-cream hover:border-cream/60 transition-colors"
		>
			<span className="sr-only">{label}</span>
			<svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
				<path d={path} />
			</svg>
		</a>
	);
}

export function Footer() {
	return (
		<footer className="bg-espresso-marquee text-cream">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
				<div className="py-16 sm:py-20 grid grid-cols-2 md:grid-cols-5 gap-10 sm:gap-12">
					{/* Brand */}
					<div className="col-span-2 md:col-span-2 sm:max-w-xs">
						<YnsLink prefetch={"eager"} href="/" className="font-display text-3xl text-cream">
							Your Next Store
						</YnsLink>
						<p className="mt-5 text-sm text-cream/55 leading-relaxed max-w-xs">
							Sparkling espresso, slow-pressed citrus, small-batch joy. Brewed for the unhurried hours.
						</p>
						<div className="mt-7 flex items-center gap-3">
							<SocialIcon
								label="Instagram"
								path="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.9.2 2.4.4.6.2 1 .5 1.5 1s.8.9 1 1.5c.2.5.3 1.2.4 2.4.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.9-.4 2.4-.2.6-.5 1-1 1.5s-.9.8-1.5 1c-.5.2-1.2.3-2.4.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.9-.2-2.4-.4-.6-.2-1-.5-1.5-1s-.8-.9-1-1.5c-.2-.5-.3-1.2-.4-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.9.4-2.4.2-.6.5-1 1-1.5s.9-.8 1.5-1c.5-.2 1.2-.3 2.4-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1 .1-1.6.2-1.9.3-.5.2-.8.4-1.1.7-.3.3-.5.6-.7 1.1-.1.3-.3.9-.3 1.9C3.2 9.3 3.2 9.7 3.2 12s0 2.7.1 3.9c0 1 .2 1.6.3 1.9.2.5.4.8.7 1.1.3.3.6.5 1.1.7.3.1.9.3 1.9.3 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1 0 1.6-.2 1.9-.3.5-.2.8-.4 1.1-.7.3-.3.5-.6.7-1.1.1-.3.3-.9.3-1.9.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c0-1-.2-1.6-.3-1.9-.2-.5-.4-.8-.7-1.1-.3-.3-.6-.5-1.1-.7-.3-.1-.9-.3-1.9-.3-1.2-.1-1.6-.1-4.7-.1zm0 3.1a4.9 4.9 0 110 9.8 4.9 4.9 0 010-9.8zm0 1.8a3.1 3.1 0 100 6.2 3.1 3.1 0 000-6.2zm5.1-2a1.15 1.15 0 110 2.3 1.15 1.15 0 010-2.3z"
							/>
							<SocialIcon
								label="Twitter"
								path="M22 5.8c-.7.3-1.5.6-2.4.7.8-.5 1.5-1.3 1.8-2.2-.8.5-1.7.8-2.6 1A4.1 4.1 0 0011.7 9c0 .3 0 .6.1.9C8.3 9.7 5.4 8.1 3.4 5.6c-.3.6-.5 1.3-.5 2 0 1.4.7 2.7 1.8 3.4-.7 0-1.3-.2-1.8-.5v.1c0 2 1.4 3.6 3.3 4-.4.1-.7.2-1.1.2-.3 0-.5 0-.8-.1.5 1.6 2 2.8 3.8 2.9-1.4 1.1-3.2 1.7-5.1 1.7H2c1.9 1.2 4.1 1.9 6.5 1.9 7.7 0 11.9-6.4 11.9-11.9v-.5c.8-.6 1.5-1.3 2-2.1z"
							/>
							<SocialIcon
								label="TikTok"
								path="M19.6 6.7a5.5 5.5 0 01-3.3-1.1V15a5.7 5.7 0 11-5.7-5.7c.3 0 .6 0 .9.1v3a2.7 2.7 0 102 2.6V2h2.9a5.5 5.5 0 005.6 5.4v-.7z"
							/>
						</div>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Support */}
					<div>
						<h3 className="text-[11px] uppercase tracking-[0.28em] font-medium text-cream/90 mb-5">Help</h3>
						<ul className="space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-cream/55 hover:text-apricot transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-cream/55 hover:text-apricot transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<FooterBlogLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-cream/55 hover:text-apricot transition-colors"
								>
									All Products
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/#about"
									className="text-sm text-cream/55 hover:text-apricot transition-colors"
								>
									Our Story
								</YnsLink>
							</li>
						</ul>
					</div>

					{/* Legal */}
					<FooterLegalPages />
				</div>

				{/* Bottom bar */}
				<div className="py-7 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-3">
					<p className="text-xs text-cream/45 uppercase tracking-[0.22em]">
						© {new Date().getFullYear()} Your Next Store — Brewed slowly.
					</p>
					<p className="text-xs text-cream/45 uppercase tracking-[0.22em]">No Alcohol · 75mg Caffeine</p>
				</div>
			</div>
		</footer>
	);
}
