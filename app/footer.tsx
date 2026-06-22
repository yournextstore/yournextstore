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
				className="text-sm text-cream/70 hover:text-cream transition-colors"
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
				className="text-sm text-cream/70 hover:text-cream transition-colors"
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
			<h3 className="text-[11px] tracking-[0.22em] uppercase font-semibold text-chartreuse">Shelves</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch="eager"
							href={`/collection/${collection.slug}`}
							className="text-sm text-cream/70 hover:text-cream transition-colors"
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
			<h3 className="text-[11px] tracking-[0.22em] uppercase font-semibold text-chartreuse">Fine print</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch="eager"
							href={`/legal${page.href}`}
							className="text-sm text-cream/70 hover:text-cream transition-colors"
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
		<svg viewBox="0 0 64 64" className="w-14 h-14" aria-hidden>
			<circle cx="32" cy="28" r="14" fill="var(--cream)" />
			<circle cx="27" cy="26" r="2.5" fill="var(--ink)" />
			<circle cx="37" cy="26" r="2.5" fill="var(--ink)" />
			<path d="M27 33 Q32 36 37 33" stroke="var(--ink)" strokeWidth="2" fill="none" strokeLinecap="round" />
			<circle cx="32" cy="18" r="2.5" fill="var(--chartreuse)" />
			<line x1="32" y1="20" x2="32" y2="14" stroke="var(--cream)" strokeWidth="1.5" />
			<path
				d="M18 42 L12 56 M24 44 L20 60 M32 45 L32 62 M40 44 L44 60 M46 42 L52 56"
				stroke="var(--cream)"
				strokeWidth="2"
				strokeLinecap="round"
			/>
		</svg>
	);
}

export function Footer() {
	return (
		<footer className="relative overflow-hidden text-cream" style={{ background: "#0a0f3d" }}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-24 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-10 sm:gap-12">
					{/* Brand */}
					<div className="col-span-2 lg:col-span-2 sm:max-w-xs">
						<YnsLink
							prefetch="eager"
							href="/"
							className="font-display text-2xl sm:text-3xl font-black text-cream"
						>
							Your Next Store
						</YnsLink>
						<p className="mt-4 text-sm text-cream/70 leading-relaxed">
							A small bookshop with big questions on every shelf. Curated, hand-bound, sent in recycled paper.
						</p>
						<div className="mt-6 flex items-center gap-4">
							<Mascot />
							<p
								className="font-display italic text-lg text-chartreuse"
								style={{ fontVariationSettings: "'SOFT' 100, 'WONK' 1" }}
							>
								Ask. Open. Discover.
							</p>
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-[11px] tracking-[0.22em] uppercase font-semibold text-chartreuse">Help</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch="eager"
									href="/about"
									className="text-sm text-cream/70 hover:text-cream transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch="eager"
									href="/faq"
									className="text-sm text-cream/70 hover:text-cream transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<FooterBlogLink />
							<li>
								<YnsLink
									prefetch="eager"
									href="/products"
									className="text-sm text-cream/70 hover:text-cream transition-colors"
								>
									All titles
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch="eager"
									href="/search"
									className="text-sm text-cream/70 hover:text-cream transition-colors"
								>
									Search the shelf
								</YnsLink>
							</li>
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-cream/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
					<p className="text-xs text-cream/55 tracking-wide">
						&copy; {new Date().getFullYear()} Your Next Store. Printed slowly, shipped politely.
					</p>
					<div className="flex items-center gap-5 text-xs text-cream/55">
						<a href="#" className="hover:text-chartreuse transition-colors">
							Instagram
						</a>
						<a href="#" className="hover:text-chartreuse transition-colors">
							Substack
						</a>
						<a href="#" className="hover:text-chartreuse transition-colors">
							Are.na
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
