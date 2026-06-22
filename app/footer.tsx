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
				className="text-sm text-[color:var(--yns-ink)]/70 hover:text-[color:var(--yns-red)] transition-colors"
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
				className="text-sm text-[color:var(--yns-ink)]/70 hover:text-[color:var(--yns-red)] transition-colors"
			>
				Contact Us
			</YnsLink>
		</li>
	);
}

const InstagramIcon = ({ className }: { className?: string }) => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
		<rect x="3" y="3" width="18" height="18" rx="5" />
		<circle cx="12" cy="12" r="4" />
		<circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
	</svg>
);

const TiktokIcon = ({ className }: { className?: string }) => (
	<svg viewBox="0 0 24 24" fill="currentColor" className={className}>
		<path d="M16 3v3.2A4.8 4.8 0 0 0 20.8 11v3.2a8 8 0 0 1-4.8-1.6v5.6a5.6 5.6 0 1 1-5.6-5.6c.27 0 .54.02.8.06v3.27a2.4 2.4 0 1 0 1.6 2.27V3Z" />
	</svg>
);

const PinterestIcon = ({ className }: { className?: string }) => (
	<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
		<circle cx="12" cy="12" r="9" />
		<path d="M10.5 8.5c0 0-2 1 0 4l-1.5 6" />
		<path d="M11 14c1 2 4 1 4-2.5C15 9 13.5 8 12 8s-3 1.5-3 3" />
	</svg>
);

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[color:var(--yns-ink)]">
				Shop
			</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-[color:var(--yns-ink)]/70 hover:text-[color:var(--yns-red)] transition-colors"
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
			<h3 className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[color:var(--yns-ink)]">
				Fine Print
			</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-[color:var(--yns-ink)]/70 hover:text-[color:var(--yns-red)] transition-colors"
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
		<footer className="bg-[color:var(--yns-cream)] border-t border-[color:var(--yns-ink)]/10">
			{/* Marquee strip */}
			<div className="bg-[color:var(--yns-red)] overflow-hidden">
				<div className="yns-marquee flex whitespace-nowrap py-3 text-white font-display text-2xl tracking-wide uppercase">
					{Array.from({ length: 2 }).map((_, group) => (
						<div key={`marquee-${group}`} className="flex shrink-0">
							{["Good Hair Days", "Free Shipping Over $60", "Clean. Cruelty-Free.", "Made For Real Hair"].map(
								(item) => (
									<span key={item} className="flex items-center px-6">
										<span>{item}</span>
										<span className="ml-6 text-[color:var(--yns-pink)]">✦</span>
									</span>
								),
							)}
						</div>
					))}
				</div>
			</div>

			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
				<div className="py-16 grid grid-cols-2 md:grid-cols-12 gap-10">
					{/* Brand */}
					<div className="col-span-2 md:col-span-5">
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-script text-5xl text-[color:var(--yns-red)] -rotate-3 inline-block"
						>
							Your Next Store
						</YnsLink>
						<p className="mt-5 text-sm text-[color:var(--yns-ink)]/70 leading-relaxed max-w-xs">
							Bold, body-positive haircare for every wild, beautiful head of hair on this messy planet.
						</p>
						<div className="mt-6 flex items-center gap-3">
							{[InstagramIcon, TiktokIcon, PinterestIcon].map((Icon, i) => (
								<a
									key={i}
									href="#"
									className="w-10 h-10 flex items-center justify-center bg-white text-[color:var(--yns-ink)] hover:bg-[color:var(--yns-red)] hover:text-white transition-colors"
									aria-label="Social link"
								>
									<Icon className="w-4 h-4" />
								</a>
							))}
						</div>
					</div>

					<div className="md:col-span-2">
						<FooterCollections />
					</div>

					<div className="md:col-span-2">
						<h3 className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[color:var(--yns-ink)]">
							Help
						</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-[color:var(--yns-ink)]/70 hover:text-[color:var(--yns-red)] transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-[color:var(--yns-ink)]/70 hover:text-[color:var(--yns-red)] transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<FooterBlogLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-[color:var(--yns-ink)]/70 hover:text-[color:var(--yns-red)] transition-colors"
								>
									Shop All
								</YnsLink>
							</li>
						</ul>
					</div>

					<div className="md:col-span-3">
						<FooterLegalPages />
					</div>
				</div>

				<div className="py-6 border-t border-[color:var(--yns-ink)]/10 flex flex-col sm:flex-row items-center justify-between gap-2">
					<p className="text-xs text-[color:var(--yns-ink)]/60">
						&copy; {new Date().getFullYear()} Your Next Store. Made with mess and love.
					</p>
					<p className="text-xs text-[color:var(--yns-ink)]/60 uppercase tracking-wide">
						All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
