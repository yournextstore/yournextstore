import { MapPin } from "lucide-react";
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
				className="text-sm text-white/70 transition-colors hover:text-white"
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
				className="text-sm text-white/70 transition-colors hover:text-white"
			>
				Contact Us
			</YnsLink>
		</li>
	);
}

function IGIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
			<rect x="3" y="3" width="18" height="18" rx="4" />
			<circle cx="12" cy="12" r="4" />
			<circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
		</svg>
	);
}
function XIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" className={className}>
			<path d="M18.244 2H21l-6.49 7.43L22 22h-6.875l-4.48-5.91L5.4 22H2.64l6.95-7.95L2 2h7.04l4.06 5.36L18.24 2zm-2.41 18h1.83L7.27 4H5.32l10.51 16z" />
		</svg>
	);
}
function YTIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" className={className}>
			<path d="M23 7.2s-.22-1.55-.9-2.23c-.86-.9-1.83-.9-2.27-.96C16.66 3.78 12 3.78 12 3.78s-4.66 0-7.83.23c-.44.06-1.41.06-2.27.96C1.22 5.65 1 7.2 1 7.2S.78 9 .78 10.8v1.4c0 1.8.22 3.6.22 3.6s.22 1.55.9 2.23c.86.9 2 .88 2.5.98 1.8.17 7.6.23 7.6.23s4.66-.01 7.83-.24c.44-.06 1.41-.06 2.27-.96.68-.68.9-2.23.9-2.23s.22-1.8.22-3.6v-1.4C23.22 9 23 7.2 23 7.2zM9.74 14.4V8.34l6.02 3.04-6.02 3.02z" />
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
			<h3 className="jolt-eyebrow text-[#ffcc00]">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-white/70 transition-colors hover:text-white"
						>
							{collection.name}
						</YnsLink>
					</li>
				))}
				<li>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="text-sm text-white/70 transition-colors hover:text-white"
					>
						All Coffee
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
			<h3 className="jolt-eyebrow text-[#ffcc00]">Fine print</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-white/70 transition-colors hover:text-white"
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
		<footer className="relative bg-[#0e0e0e] text-[#f2f2f2]">
			{/* Top yellow accent line */}
			<div className="h-1 bg-[#ffcc00]" />

			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Locator band */}
				<div className="grid items-center gap-6 border-b border-white/10 py-10 lg:grid-cols-12">
					<div className="lg:col-span-7">
						<span className="jolt-eyebrow text-[#ffcc00]">— Locator</span>
						<h3 className="jolt-headline mt-2 text-2xl sm:text-3xl">Find a can near you.</h3>
					</div>
					<form className="flex gap-2 lg:col-span-5">
						<div className="relative flex-1">
							<MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
							<input
								type="text"
								placeholder="Enter ZIP or city"
								className="h-12 w-full border border-white/20 bg-transparent pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#ffcc00]"
							/>
						</div>
						<button
							type="button"
							className="inline-flex h-12 shrink-0 items-center justify-center gap-2 bg-[#ffcc00] px-6 text-xs font-bold uppercase tracking-[0.18em] text-[#0e0e0e] transition-all hover:translate-y-[-2px]"
						>
							Search
						</button>
					</form>
				</div>

				{/* Main */}
				<div className="grid gap-12 py-16 lg:grid-cols-12">
					<div className="lg:col-span-5">
						<YnsLink prefetch={"eager"} href="/" className="flex flex-col leading-none">
							<span className="jolt-headline text-3xl tracking-[0.05em] text-white">YOUR&nbsp;NEXT</span>
							<span className="jolt-eyebrow mt-1 text-[#ffcc00]">— Coffee Co.</span>
						</YnsLink>
						<p className="mt-5 max-w-sm text-sm text-white/65 leading-relaxed">
							Simply great f*ing coffee. Roasted dark in Brooklyn, shipped fresh worldwide. Subscribe and
							never run out.
						</p>
						<div className="mt-6 flex items-center gap-3">
							{[IGIcon, XIcon, YTIcon].map((Icon, i) => (
								<a
									key={i}
									href="https://instagram.com"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex h-10 w-10 items-center justify-center border border-white/15 transition-colors hover:border-[#ffcc00] hover:text-[#ffcc00]"
								>
									<Icon className="h-4 w-4" />
								</a>
							))}
						</div>
					</div>

					<div className="grid grid-cols-2 gap-8 lg:col-span-7 lg:grid-cols-3">
						<FooterCollections />
						<div>
							<h3 className="jolt-eyebrow text-[#ffcc00]">Support</h3>
							<ul className="mt-5 space-y-3">
								<li>
									<YnsLink
										prefetch={"eager"}
										href="/faq"
										className="text-sm text-white/70 transition-colors hover:text-white"
									>
										FAQ
									</YnsLink>
								</li>
								<li>
									<YnsLink
										prefetch={"eager"}
										href="#origin"
										className="text-sm text-white/70 transition-colors hover:text-white"
									>
										Origin Story
									</YnsLink>
								</li>
								<li>
									<YnsLink
										prefetch={"eager"}
										href="#locator"
										className="text-sm text-white/70 transition-colors hover:text-white"
									>
										Cafe Locator
									</YnsLink>
								</li>
								<li>
									<YnsLink
										prefetch={"eager"}
										href="/about"
										className="text-sm text-white/70 transition-colors hover:text-white"
									>
										About Us
									</YnsLink>
								</li>
								<FooterContactLink />
								<FooterBlogLink />
							</ul>
						</div>
						<FooterLegalPages />
					</div>
				</div>

				{/* Bottom bar */}
				<div className="flex flex-col items-start justify-between gap-3 border-t border-white/10 py-6 sm:flex-row sm:items-center">
					<p className="text-xs uppercase tracking-[0.22em] text-white/45">
						© {new Date().getFullYear()} Your Next Store. All rights reserved.
					</p>
					<p className="text-xs uppercase tracking-[0.22em] text-white/45">
						Brewed in Brooklyn — shipped to your curb
					</p>
				</div>
			</div>
		</footer>
	);
}
