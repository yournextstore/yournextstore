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
				className="text-sm text-yns-cream-soft/80 hover:text-yns-yellow transition-colors italic"
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
				className="text-sm text-yns-cream-soft/80 hover:text-yns-yellow transition-colors italic"
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
			<h3 className="font-display text-yns-yellow text-lg tracking-wide">Shop</h3>
			<ul className="mt-4 space-y-2.5">
				<li>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="text-sm text-yns-cream-soft/80 hover:text-yns-yellow transition-colors italic"
					>
						All flavor packs
					</YnsLink>
				</li>
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-yns-cream-soft/80 hover:text-yns-yellow transition-colors italic"
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
			<h3 className="font-display text-yns-yellow text-lg tracking-wide">Fine print</h3>
			<ul className="mt-4 space-y-2.5">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-yns-cream-soft/80 hover:text-yns-yellow transition-colors italic"
						>
							{page.label}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

function FooterMascot() {
	return (
		<svg viewBox="0 0 200 200" aria-hidden="true" className="w-32 h-32">
			<path
				d="M40 110 C 40 70, 80 60, 95 80 C 105 95, 80 100, 90 80 C 100 60, 135 65, 135 95 L 135 130"
				stroke="#f7d26b"
				strokeWidth="14"
				fill="none"
				strokeLinecap="round"
			/>
			<circle cx="130" cy="78" r="26" fill="#f7d26b" stroke="#fcefc8" strokeWidth="3" />
			<circle cx="123" cy="73" r="3.5" fill="#3a1f12" />
			<circle cx="138" cy="73" r="3.5" fill="#3a1f12" />
			<path
				d="M120 86 Q 130 94, 142 86"
				stroke="#3a1f12"
				strokeWidth="2.5"
				fill="none"
				strokeLinecap="round"
			/>
			<g fill="#f04a23">
				<path d="M30 30 L 33 38 L 41 41 L 33 44 L 30 52 L 27 44 L 19 41 L 27 38 Z" />
				<path d="M170 50 L 172 56 L 178 58 L 172 60 L 170 66 L 168 60 L 162 58 L 168 56 Z" />
			</g>
		</svg>
	);
}

export function Footer() {
	return (
		<footer className="bg-yns-brown text-yns-cream-soft">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-14 sm:py-20 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-10">
					{/* Brand + mascot */}
					<div className="col-span-2 sm:col-span-4 lg:col-span-2">
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-display text-3xl sm:text-4xl text-yns-cream-soft inline-block"
						>
							Your<span className="text-yns-yellow">&apos;</span>NextStore
						</YnsLink>
						<p className="mt-4 text-sm text-yns-cream-soft/70 italic max-w-xs leading-relaxed">
							Small-batch crunch worth sharing. Made with care, packed with confetti, sent with love.
						</p>
						<FooterMascot />
					</div>

					<FooterCollections />

					<div>
						<h3 className="font-display text-yns-yellow text-lg tracking-wide">Help</h3>
						<ul className="mt-4 space-y-2.5">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-yns-cream-soft/80 hover:text-yns-yellow transition-colors italic"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-yns-cream-soft/80 hover:text-yns-yellow transition-colors italic"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/search"
									className="text-sm text-yns-cream-soft/80 hover:text-yns-yellow transition-colors italic"
								>
									Search
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-yns-cream-soft/15 flex flex-col sm:flex-row gap-3 justify-between items-center">
					<p className="text-xs text-yns-cream-soft/60 italic">
						&copy; {new Date().getFullYear()} Your Next Store. Crunch responsibly.
					</p>
					<p className="font-script text-yns-yellow text-lg">#sendsnoods</p>
				</div>
			</div>
		</footer>
	);
}
