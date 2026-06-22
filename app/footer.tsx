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
				className="text-sm text-[var(--tropic-cream)]/80 hover:text-[var(--tropic-yellow)] transition-colors"
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
				className="text-sm text-[var(--tropic-cream)]/80 hover:text-[var(--tropic-yellow)] transition-colors"
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
			<h3 className="text-[11px] font-semibold text-[var(--tropic-yellow)] uppercase tracking-[0.28em]">
				Collections
			</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="font-display text-lg italic text-[var(--tropic-cream)] hover:text-[var(--tropic-yellow)] transition-colors"
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
			<h3 className="text-[11px] font-semibold text-[var(--tropic-yellow)] uppercase tracking-[0.28em]">
				Legal
			</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-[var(--tropic-cream)]/80 hover:text-[var(--tropic-yellow)] transition-colors"
						>
							{page.label}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

function PalmFlourish() {
	return (
		<svg
			viewBox="0 0 600 200"
			className="absolute -bottom-1 right-0 w-[420px] sm:w-[640px] opacity-25 pointer-events-none"
			fill="none"
			aria-hidden="true"
		>
			<title>Palm flourish</title>
			<path
				d="M580 200 C 440 140, 350 110, 260 130"
				stroke="#f7e9c9"
				strokeWidth="1.4"
				strokeLinecap="round"
			/>
			<path
				d="M450 130 C 470 110, 510 90, 560 100"
				stroke="#f7e9c9"
				strokeWidth="1.2"
				strokeLinecap="round"
			/>
			<path
				d="M380 145 C 400 120, 430 100, 470 95"
				stroke="#f7e9c9"
				strokeWidth="1.2"
				strokeLinecap="round"
			/>
			<path
				d="M320 158 C 340 130, 370 115, 410 110"
				stroke="#f7e9c9"
				strokeWidth="1.2"
				strokeLinecap="round"
			/>
			<path d="M260 130 C 250 100, 230 80, 200 80" stroke="#f7e9c9" strokeWidth="1.2" strokeLinecap="round" />
		</svg>
	);
}

export function Footer() {
	return (
		<footer className="relative bg-[#15323b] text-[var(--tropic-cream)] overflow-hidden">
			<PalmFlourish />
			<div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid gap-10 sm:gap-12 sm:grid-cols-2 lg:grid-cols-12">
					{/* Brand */}
					<div className="lg:col-span-5">
						<YnsLink prefetch={"eager"} href="/" className="block">
							<span className="font-display text-3xl sm:text-4xl tracking-[0.18em] text-[var(--tropic-yellow)] uppercase">
								Your Next Store
							</span>
							<span className="mt-1 block text-[10px] tracking-[0.32em] uppercase text-[var(--tropic-cream)]/70">
								Plant Powered Protection
							</span>
						</YnsLink>
						<p className="mt-6 max-w-md text-[15px] leading-relaxed text-[var(--tropic-cream)]/80">
							Adventure essentials made with food-grade botanicals and a serious dislike of single-use
							plastic. Built for humid jungle, alpine ridge, and everything between.
						</p>
						<div className="mt-6 flex items-center gap-3">
							{["IG", "TT", "YT", "PT"].map((s) => (
								<span
									key={s}
									className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--tropic-cream)]/25 text-[11px] font-semibold tracking-widest text-[var(--tropic-cream)]/85 hover:bg-[var(--tropic-yellow)] hover:text-[#15323b] hover:border-[var(--tropic-yellow)] transition-colors cursor-pointer"
								>
									{s}
								</span>
							))}
						</div>
					</div>

					{/* Collections */}
					<div className="lg:col-span-3">
						<FooterCollections />
					</div>

					{/* Support */}
					<div className="lg:col-span-2">
						<h3 className="text-[11px] font-semibold text-[var(--tropic-yellow)] uppercase tracking-[0.28em]">
							Support
						</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-[var(--tropic-cream)]/80 hover:text-[var(--tropic-yellow)] transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-[var(--tropic-cream)]/80 hover:text-[var(--tropic-yellow)] transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-[var(--tropic-cream)]/80 hover:text-[var(--tropic-yellow)] transition-colors"
								>
									Shop all
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					{/* Legal */}
					<div className="lg:col-span-2">
						<FooterLegalPages />
					</div>
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-[var(--tropic-cream)]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
					<p className="text-xs text-[var(--tropic-cream)]/60 tracking-wide">
						&copy; {new Date().getFullYear()} Your Next Store. Plant powered, protection promised.
					</p>
					<p className="text-[11px] uppercase tracking-[0.32em] text-[var(--tropic-cream)]/60">
						Made with care · California, USA
					</p>
				</div>
			</div>
		</footer>
	);
}
