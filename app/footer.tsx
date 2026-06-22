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
				className="text-sm text-[#f5e6d3]/70 hover:text-[#c99a5e] transition-colors"
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
				className="text-sm text-[#f5e6d3]/70 hover:text-[#c99a5e] transition-colors"
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
			<h3 className="font-display text-sm font-bold tracking-[0.24em] uppercase text-[#f5e6d3]">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-[#f5e6d3]/70 hover:text-[#c99a5e] transition-colors"
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
			<h3 className="font-display text-sm font-bold tracking-[0.24em] uppercase text-[#f5e6d3]">
				Fine Print
			</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-[#f5e6d3]/70 hover:text-[#c99a5e] transition-colors"
						>
							{page.label}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

function Mascot() {
	return (
		<svg viewBox="0 0 180 160" className="w-44 h-auto" aria-hidden>
			{/* Two folk sisters illustration */}
			<g transform="translate(40 30)">
				<circle cx="0" cy="0" r="18" fill="#f5e6d3" stroke="#c99a5e" strokeWidth="2" />
				<path d="M -16 -8 Q -12 -22 0 -18 Q 12 -22 16 -8" fill="#8b3a3a" stroke="#4a2c1a" strokeWidth="1.5" />
				<path d="M -20 -8 Q -28 16 -16 30" fill="#8b3a3a" stroke="#4a2c1a" strokeWidth="1.5" />
				<path d="M 20 -8 Q 28 16 16 30" fill="#8b3a3a" stroke="#4a2c1a" strokeWidth="1.5" />
				<circle cx="-5" cy="-1" r="1.6" fill="#4a2c1a" />
				<circle cx="5" cy="-1" r="1.6" fill="#4a2c1a" />
				<circle cx="-9" cy="3" r="2" fill="#d27a7a" opacity="0.7" />
				<circle cx="9" cy="3" r="2" fill="#d27a7a" opacity="0.7" />
				<path d="M -4 6 Q 0 9 4 6" stroke="#4a2c1a" strokeWidth="1.4" fill="none" strokeLinecap="round" />
				<path d="M -18 18 L -22 50 L 22 50 L 18 18 Z" fill="#a8b5a0" stroke="#4a2c1a" strokeWidth="1.5" />
				<path d="M -10 30 L -10 50 M 10 30 L 10 50" stroke="#4a2c1a" strokeWidth="1" />
			</g>
			<g transform="translate(120 38)">
				<circle cx="0" cy="0" r="16" fill="#f5e6d3" stroke="#c99a5e" strokeWidth="2" />
				<path d="M -14 -8 Q -10 -20 0 -16 Q 10 -20 14 -8" fill="#c99a5e" stroke="#4a2c1a" strokeWidth="1.5" />
				<path d="M -18 -6 Q -22 14 -14 26" fill="#c99a5e" stroke="#4a2c1a" strokeWidth="1.5" />
				<path d="M 18 -6 Q 22 14 14 26" fill="#c99a5e" stroke="#4a2c1a" strokeWidth="1.5" />
				<circle cx="-4" cy="-1" r="1.4" fill="#4a2c1a" />
				<circle cx="4" cy="-1" r="1.4" fill="#4a2c1a" />
				<circle cx="-8" cy="3" r="1.8" fill="#d27a7a" opacity="0.7" />
				<circle cx="8" cy="3" r="1.8" fill="#d27a7a" opacity="0.7" />
				<path d="M -3 6 Q 0 8 3 6" stroke="#4a2c1a" strokeWidth="1.3" fill="none" strokeLinecap="round" />
				<path d="M -16 16 L -18 44 L 18 44 L 16 16 Z" fill="#d27a7a" stroke="#4a2c1a" strokeWidth="1.5" />
			</g>
			<path
				d="M 20 110 Q 90 100 160 110"
				stroke="#c99a5e"
				strokeWidth="2"
				strokeLinecap="round"
				fill="none"
				strokeDasharray="3 4"
			/>
		</svg>
	);
}

export function Footer() {
	return (
		<footer className="bg-cocoa-deep text-[#f5e6d3]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 grid gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
					{/* Brand */}
					<div className="sm:col-span-2 lg:col-span-1">
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-display text-2xl font-extrabold text-[#f5e6d3]"
						>
							Your Next Store
						</YnsLink>
						<p className="mt-4 text-sm text-[#f5e6d3]/70 leading-relaxed max-w-xs">
							Wholesome, small-batch goods made on a family farm. Real ingredients, real people, real good.
						</p>
						<div className="mt-6 flex items-center gap-3">
							<YnsLink
								href="#"
								prefetch="eager"
								aria-label="Instagram"
								className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#f5e6d3]/30 hover:bg-[#c99a5e] hover:border-[#c99a5e] hover:text-[#4a2c1a] transition-colors"
							>
								<svg
									className="h-4 w-4"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden
								>
									<rect x="2" y="2" width="20" height="20" rx="5" />
									<circle cx="12" cy="12" r="4" />
									<circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
								</svg>
							</YnsLink>
							<YnsLink
								href="#"
								prefetch="eager"
								aria-label="TikTok"
								className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#f5e6d3]/30 hover:bg-[#c99a5e] hover:border-[#c99a5e] hover:text-[#4a2c1a] transition-colors text-xs font-bold"
							>
								TT
							</YnsLink>
							<YnsLink
								href="#"
								prefetch="eager"
								aria-label="Pinterest"
								className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#f5e6d3]/30 hover:bg-[#c99a5e] hover:border-[#c99a5e] hover:text-[#4a2c1a] transition-colors text-xs font-bold"
							>
								P
							</YnsLink>
						</div>
					</div>

					{/* Shop / Collections */}
					<FooterCollections />

					{/* Support */}
					<div>
						<h3 className="font-display text-sm font-bold tracking-[0.24em] uppercase text-[#f5e6d3]">
							Help
						</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-[#f5e6d3]/70 hover:text-[#c99a5e] transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-[#f5e6d3]/70 hover:text-[#c99a5e] transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-[#f5e6d3]/70 hover:text-[#c99a5e] transition-colors"
								>
									Where to Buy
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/newsletter"
									className="text-sm text-[#f5e6d3]/70 hover:text-[#c99a5e] transition-colors"
								>
									Newsletter
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="border-t border-[#f5e6d3]/15 py-8 flex flex-col items-center gap-6">
					<Mascot />
					<p className="text-xs sm:text-sm text-[#f5e6d3]/60 font-display tracking-wider">
						&copy; {new Date().getFullYear()} Your Next Store · Made with love &amp; real ingredients
					</p>
				</div>
			</div>
		</footer>
	);
}
