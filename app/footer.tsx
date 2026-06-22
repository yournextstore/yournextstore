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
				className="text-sm text-[color:var(--color-bone)]/85 hover:text-[color:var(--color-blush)] transition-colors"
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
				className="text-sm text-[color:var(--color-bone)]/85 hover:text-[color:var(--color-blush)] transition-colors"
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
			<h3 className="text-eyebrow text-[color:var(--color-bone)]/60 mb-5">Shop</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-[color:var(--color-bone)]/85 hover:text-[color:var(--color-blush)] transition-colors"
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
			<h3 className="text-eyebrow text-[color:var(--color-bone)]/60 mb-5">The Fine Print</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-[color:var(--color-bone)]/85 hover:text-[color:var(--color-blush)] transition-colors"
						>
							{page.label}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

function SocialIcon({ children, label }: { children: React.ReactNode; label: string }) {
	return (
		<a
			href="#"
			aria-label={label}
			className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-bone)]/25 text-[color:var(--color-bone)]/85 hover:border-[color:var(--color-blush)] hover:text-[color:var(--color-blush)] transition-colors"
		>
			{children}
		</a>
	);
}

export function Footer() {
	return (
		<footer className="bg-[color:var(--color-slate-ink)] text-[color:var(--color-bone)]">
			<div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-10">
				<div className="grid grid-cols-2 md:grid-cols-12 gap-10 py-16 sm:py-20">
					<div className="col-span-2 md:col-span-5">
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-script text-5xl leading-none text-[color:var(--color-bone)]"
						>
							Your Next Store
						</YnsLink>
						<p className="mt-5 text-sm text-[color:var(--color-bone)]/70 leading-relaxed max-w-sm">
							Hydrating, buildable color and clean skin essentials — made in small batches, refillable for
							life.
						</p>
						<div className="mt-7 flex gap-3">
							<SocialIcon label="Instagram">
								<svg
									viewBox="0 0 24 24"
									className="h-4 w-4"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.6"
								>
									<rect x="3" y="3" width="18" height="18" rx="5" />
									<circle cx="12" cy="12" r="4" />
									<circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
								</svg>
							</SocialIcon>
							<SocialIcon label="TikTok">
								<svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
									<path d="M14 4v8.5a2.5 2.5 0 11-2.5-2.5h.5V7.8a5.2 5.2 0 105.2 5.2V8.6a6.4 6.4 0 003.3.9V6.8A4 4 0 0117 4h-3z" />
								</svg>
							</SocialIcon>
							<SocialIcon label="Pinterest">
								<svg
									viewBox="0 0 24 24"
									className="h-4 w-4"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.6"
								>
									<circle cx="12" cy="12" r="9" />
									<path
										d="M11 8c2 0 4 1 4 4s-1 4-3 4c-1 0-2-1-2-2l1-4-2 8"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</SocialIcon>
							<SocialIcon label="YouTube">
								<svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
									<path d="M22 12s0-3-.4-4.5a2.6 2.6 0 00-1.8-1.8C18.3 5.3 12 5.3 12 5.3s-6.3 0-7.8.4A2.6 2.6 0 002.4 7.5C2 9 2 12 2 12s0 3 .4 4.5a2.6 2.6 0 001.8 1.8c1.5.4 7.8.4 7.8.4s6.3 0 7.8-.4a2.6 2.6 0 001.8-1.8C22 15 22 12 22 12zM10 15V9l5 3-5 3z" />
								</svg>
							</SocialIcon>
						</div>
					</div>

					<div className="col-span-1 md:col-span-2">
						<FooterCollections />
					</div>

					<div className="col-span-1 md:col-span-2">
						<h3 className="text-eyebrow text-[color:var(--color-bone)]/60 mb-5">Help</h3>
						<ul className="space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-[color:var(--color-bone)]/85 hover:text-[color:var(--color-blush)] transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-[color:var(--color-bone)]/85 hover:text-[color:var(--color-blush)] transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<FooterBlogLink />
							<li>
								<YnsLink
									href="/products"
									className="text-sm text-[color:var(--color-bone)]/85 hover:text-[color:var(--color-blush)] transition-colors"
								>
									Shipping & Returns
								</YnsLink>
							</li>
							<li>
								<YnsLink
									href="/#about"
									className="text-sm text-[color:var(--color-bone)]/85 hover:text-[color:var(--color-blush)] transition-colors"
								>
									Refill Program
								</YnsLink>
							</li>
							<li>
								<YnsLink
									href="/faq"
									className="text-sm text-[color:var(--color-bone)]/85 hover:text-[color:var(--color-blush)] transition-colors"
								>
									Contact
								</YnsLink>
							</li>
						</ul>
					</div>

					<div className="col-span-2 md:col-span-3">
						<FooterLegalPages />
					</div>
				</div>

				<div className="py-7 border-t border-[color:var(--color-bone)]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-xs text-[color:var(--color-bone)]/55">
						&copy; {new Date().getFullYear()} Your Next Store. All rights reserved.
					</p>
					<p className="text-xs text-[color:var(--color-bone)]/55 tracking-[0.2em] uppercase">
						Made small batch · Shipped worldwide
					</p>
				</div>
			</div>
		</footer>
	);
}
