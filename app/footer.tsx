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
				className="text-sm text-[#fdf6ee]/70 hover:text-[#fdf6ee] transition-colors"
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
				className="text-sm text-[#fdf6ee]/70 hover:text-[#fdf6ee] transition-colors"
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
			<h3 className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#f2c9a6]">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-[#fdf6ee]/70 hover:text-[#fdf6ee] transition-colors"
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
			<h3 className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#f2c9a6]">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-[#fdf6ee]/70 hover:text-[#fdf6ee] transition-colors"
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
		<footer className="bg-[#1a1a2e] text-[#fdf6ee] overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-16 sm:pt-20">
				<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-10 pb-14">
					<div className="col-span-2 lg:col-span-2 max-w-sm">
						<p className="font-script text-3xl text-[#fdf6ee]">Your Next Store</p>
						<p className="text-[10px] uppercase tracking-[0.3em] text-[#f2c9a6] mt-1">Naturally Good</p>
						<p className="mt-5 text-sm text-[#fdf6ee]/70 leading-relaxed">
							Bold scents, clean ingredients, small-batch obsession. Hand-poured for people who actually read
							the back of the label.
						</p>
						<div className="mt-7 flex items-center gap-3">
							<a
								href="https://instagram.com"
								className="w-10 h-10 rounded-full border border-[#fdf6ee]/20 flex items-center justify-center hover:bg-[#fdf6ee] hover:text-[#1a1a2e] transition-colors"
								aria-label="Instagram"
							>
								<svg
									className="w-4 h-4"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<rect x="2" y="2" width="20" height="20" rx="5" />
									<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
									<line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
								</svg>
							</a>
							<a
								href="https://twitter.com"
								className="w-10 h-10 rounded-full border border-[#fdf6ee]/20 flex items-center justify-center hover:bg-[#fdf6ee] hover:text-[#1a1a2e] transition-colors"
								aria-label="Twitter"
							>
								<svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
									<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
								</svg>
							</a>
							<a
								href="https://youtube.com"
								className="w-10 h-10 rounded-full border border-[#fdf6ee]/20 flex items-center justify-center hover:bg-[#fdf6ee] hover:text-[#1a1a2e] transition-colors"
								aria-label="YouTube"
							>
								<svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
									<path d="M21.582 6.186a2.506 2.506 0 0 0-1.768-1.768C18.254 4 12 4 12 4s-6.254 0-7.814.418A2.506 2.506 0 0 0 2.418 6.186 26.07 26.07 0 0 0 2 12a26.07 26.07 0 0 0 .418 5.814 2.506 2.506 0 0 0 1.768 1.768C5.746 20 12 20 12 20s6.254 0 7.814-.418a2.506 2.506 0 0 0 1.768-1.768A26.07 26.07 0 0 0 22 12a26.07 26.07 0 0 0-.418-5.814zM10 15.464V8.536L16 12z" />
								</svg>
							</a>
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#f2c9a6]">Support</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-[#fdf6ee]/70 hover:text-[#fdf6ee] transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-[#fdf6ee]/70 hover:text-[#fdf6ee] transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									href="/products"
									className="text-sm text-[#fdf6ee]/70 hover:text-[#fdf6ee] transition-colors"
								>
									Shipping
								</YnsLink>
							</li>
							<li>
								<YnsLink
									href="/faq"
									className="text-sm text-[#fdf6ee]/70 hover:text-[#fdf6ee] transition-colors"
								>
									Returns
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				{/* Oversized wordmark */}
				<div className="border-t border-[#fdf6ee]/15 pt-10 pb-6">
					<p className="font-script text-[16vw] sm:text-[14vw] leading-none text-[#fdf6ee]/95 text-center -tracking-tight select-none">
						Your Next Store
					</p>
				</div>

				<div className="py-6 border-t border-[#fdf6ee]/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
					<p className="text-[#fdf6ee]/50">
						&copy; {new Date().getFullYear()} Your Next Store. Naturally good, always.
					</p>
					<p className="text-[#fdf6ee]/50 tracking-wide uppercase">Hand-poured in small batches</p>
				</div>
			</div>
		</footer>
	);
}
