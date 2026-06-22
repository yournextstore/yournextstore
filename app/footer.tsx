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

function FacebookIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.3-1.5 1.6-1.5H17V4.2c-.3 0-1.2-.1-2.3-.1-2.3 0-3.7 1.4-3.7 3.9v2H8.5v3h2.5V21h2.5z" />
		</svg>
	);
}

function InstagramIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<rect x="3" y="3" width="18" height="18" rx="5" />
			<circle cx="12" cy="12" r="4" />
			<circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
		</svg>
	);
}

function TwitterIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M18.244 3H21l-6.52 7.45L22 21h-6.18l-4.84-6.32L5.4 21H2.64l6.97-7.96L2 3h6.34l4.37 5.78L18.24 3zm-2.17 16.13h1.71L7.99 4.77H6.16l9.91 14.36z" />
		</svg>
	);
}

function YoutubeIcon({ className }: { className?: string }) {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M21.6 7.2c-.2-.9-.9-1.6-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8c.2.9.9 1.6 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3-5.2 3z" />
		</svg>
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
			<h3 className="text-sm font-bold text-foreground mb-4">Collections</h3>
			<ul className="space-y-3">
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
			<h3 className="text-sm font-semibold text-foreground">Legal</h3>
			<ul className="mt-4 space-y-3">
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
		<footer className="w-full max-w-[1600px] mx-auto px-4 md:px-6 py-8">
			<div className="bg-card rounded-3xl p-8 md:p-12 shadow-soft">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
					{/* Brand Section */}
					<div className="lg:col-span-1">
						<div className="flex items-center gap-2 mb-4">
							<div className="w-8 h-8 bg-foreground text-background rounded-lg flex items-center justify-center font-bold text-xl">
								A
							</div>
							<span className="text-xl font-bold tracking-tight">aura.</span>
						</div>
						<p className="text-sm text-muted-foreground leading-relaxed mb-6">
							Elevate your sound with premium audio equipment. Crafted with precision, designed for
							audiophiles.
						</p>
						{/* Social Icons */}
						<div className="flex gap-3">
							<button
								type="button"
								aria-label="Facebook"
								className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
							>
								<FacebookIcon className="w-4 h-4" />
							</button>
							<button
								type="button"
								aria-label="Instagram"
								className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
							>
								<InstagramIcon className="w-4 h-4" />
							</button>
							<button
								type="button"
								aria-label="Twitter"
								className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
							>
								<TwitterIcon className="w-4 h-4" />
							</button>
							<button
								type="button"
								aria-label="Youtube"
								className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
							>
								<YoutubeIcon className="w-4 h-4" />
							</button>
						</div>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Support */}
					<div>
						<h3 className="text-sm font-bold text-foreground mb-4">Support</h3>
						<ul className="space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/contact"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									Contact Us
								</YnsLink>
							</li>
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
									FAQs
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/shipping"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									Shipping Info
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/returns"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									Returns
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					{/* Newsletter */}
					<div>
						<h3 className="text-sm font-bold text-foreground mb-4">Newsletter</h3>
						<p className="text-sm text-muted-foreground mb-4">Subscribe for exclusive offers and updates.</p>
						<form className="flex gap-2">
							<input
								type="email"
								placeholder="Enter your email"
								className="flex-1 px-4 py-2 bg-secondary rounded-full text-sm outline-none focus:ring-2 focus:ring-primary"
							/>
							<button
								type="submit"
								className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
							>
								Join
							</button>
						</form>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
					<p className="text-sm text-muted-foreground">
						&copy; {new Date().getFullYear()} Aura Audio. All rights reserved.
					</p>
					<div className="flex items-center gap-6">
						<YnsLink
							prefetch={"eager"}
							href="/privacy"
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							Privacy Policy
						</YnsLink>
						<YnsLink
							prefetch={"eager"}
							href="/terms"
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							Terms of Service
						</YnsLink>
					</div>
				</div>
			</div>
		</footer>
	);
}
