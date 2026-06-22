import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
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
			<Link href="/blog" className="text-sm text-cream/70 hover:text-cream transition-colors">
				Blog
			</Link>
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
			<Link href="/contact" className="text-sm text-cream/70 hover:text-cream transition-colors">
				Contact Us
			</Link>
		</li>
	);
}

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ active: true, limit: 5 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="text-[11px] tracking-[0.22em] uppercase font-semibold text-chartreuse">Shelves</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-cream/70 hover:text-cream transition-colors"
						>
							{collection.name}
						</Link>
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
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-cream/70 hover:text-cream transition-colors"
						>
							{page.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

// `new Date()` is an unstable value: now that the footer is part of the prerendered
// shell, reading it during the prerender is an error. Caching pins it to the entry.
async function getCopyrightYear() {
	"use cache";
	cacheLife("days");

	return new Date().getFullYear();
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

export async function Footer() {
	const year = await getCopyrightYear();

	return (
		<footer className="relative overflow-hidden text-cream" style={{ background: "#0a0f3d" }}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-24 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-10 sm:gap-12">
					{/* Brand */}
					<div className="col-span-2 lg:col-span-2 sm:max-w-xs">
						<Link href="/" className="font-display text-2xl sm:text-3xl font-black text-cream">
							Your Next Store
						</Link>
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
								<Link href="/about" className="text-sm text-cream/70 hover:text-cream transition-colors">
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link href="/faq" className="text-sm text-cream/70 hover:text-cream transition-colors">
									FAQ
								</Link>
							</li>
							<FooterBlogLink />
							<li>
								<Link href="/products" className="text-sm text-cream/70 hover:text-cream transition-colors">
									All titles
								</Link>
							</li>
							<li>
								<Link href="/search" className="text-sm text-cream/70 hover:text-cream transition-colors">
									Search the shelf
								</Link>
							</li>
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-cream/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
					<p className="text-xs text-cream/55 tracking-wide">
						&copy; {year} Your Next Store. Printed slowly, shipped politely.
					</p>
					<div className="flex flex-col items-start gap-4 sm:items-end">
						<div className="flex items-center gap-5 text-xs text-cream/55">
							{["Instagram", "Substack", "Are.na"].map((label) => (
								// biome-ignore lint/a11y/useValidAnchor: placeholder profile links until the store owner sets the URLs
								<a key={label} href="#" className="hover:text-chartreuse transition-colors">
									{label}
								</a>
							))}
						</div>
						<PaymentMethods />
					</div>
				</div>
			</div>
		</footer>
	);
}
