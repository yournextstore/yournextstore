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
				className="text-sm text-[#f5e4d2]/75 hover:text-[#e8b547] transition-colors"
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
				className="text-sm text-[#f5e4d2]/75 hover:text-[#e8b547] transition-colors"
			>
				Contact Us
			</YnsLink>
		</li>
	);
}

function InstagramGlyph({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.8}
			className={className}
			aria-hidden
		>
			<title>Instagram</title>
			<rect x={3} y={3} width={18} height={18} rx={5} ry={5} />
			<circle cx={12} cy={12} r={4} />
			<circle cx={17.5} cy={6.5} r={0.9} fill="currentColor" />
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
			<h3 className="text-[11px] uppercase tracking-[0.28em] text-[#e8b547]">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-[#f5e4d2]/75 hover:text-[#e8b547] transition-colors"
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
			<h3 className="text-[11px] uppercase tracking-[0.28em] text-[#e8b547]">Fine print</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-[#f5e4d2]/75 hover:text-[#e8b547] transition-colors"
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
		<footer className="bg-[#15348f] text-[#f5e4d2] border-t border-[#1f46c2]/60">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
				{/* Top brass mark */}
				<div className="py-10 border-b border-[#f5e4d2]/15 flex flex-col sm:flex-row items-center justify-between gap-5">
					<YnsLink
						prefetch={"eager"}
						href="/"
						className="font-display text-[#e8b547] text-3xl sm:text-4xl uppercase tracking-[0.32em]"
					>
						YNS
					</YnsLink>
					<p className="font-script text-2xl sm:text-3xl text-[#f5e4d2]/80">go often, slowly</p>
					<a
						href="https://instagram.com"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#f5e4d2]/80 hover:text-[#e8b547] transition-colors"
					>
						<InstagramGlyph className="h-4 w-4" />
						@yournextstore
					</a>
				</div>

				<div className="py-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10">
					{/* Brand */}
					<div className="col-span-2 lg:col-span-2 max-w-xs">
						<p className="font-display text-2xl text-[#f5e4d2] leading-tight">
							A small shop with strong feelings about light, linen, and citrus.
						</p>
						<p className="mt-5 text-sm text-[#f5e4d2]/70 leading-relaxed">
							Your Next Store · curated finds for the long, slow afternoon.
						</p>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Support */}
					<div>
						<h3 className="text-[11px] uppercase tracking-[0.28em] text-[#e8b547]">House</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-[#f5e4d2]/75 hover:text-[#e8b547] transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-[#f5e4d2]/75 hover:text-[#e8b547] transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<FooterBlogLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-[#f5e4d2]/75 hover:text-[#e8b547] transition-colors"
								>
									Shop
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="#about"
									className="text-sm text-[#f5e4d2]/75 hover:text-[#e8b547] transition-colors"
								>
									About
								</YnsLink>
							</li>
						</ul>
					</div>

					{/* Legal */}
					<FooterLegalPages />
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-[#f5e4d2]/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] uppercase tracking-[0.22em] text-[#f5e4d2]/55">
					<p>&copy; {new Date().getFullYear()} Your Next Store · All rights reserved</p>
					<p className="text-center">Designed slowly · Shipped on a Wednesday</p>
				</div>
			</div>
		</footer>
	);
}
