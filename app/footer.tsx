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
				className="text-sm text-yns-ink/65 hover:text-yns-ink transition-colors"
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
				className="text-sm text-yns-ink/65 hover:text-yns-ink transition-colors"
			>
				Contact Us
			</YnsLink>
		</li>
	);
}

const IgIcon = () => (
	<svg
		viewBox="0 0 24 24"
		className="h-4 w-4"
		fill="none"
		stroke="currentColor"
		strokeWidth={1.6}
		aria-hidden="true"
	>
		<title>Instagram</title>
		<rect x="3" y="3" width="18" height="18" rx="5" />
		<circle cx="12" cy="12" r="4" />
		<circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" />
	</svg>
);
const TiktokIcon = () => (
	<svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
		<title>TikTok</title>
		<path d="M16.5 3c.4 1.7 1.5 3 3.5 3.4v2.4c-1.3 0-2.5-.3-3.5-.9V15a5 5 0 1 1-5-5v2.5a2.5 2.5 0 1 0 2.5 2.5V3h2.5z" />
	</svg>
);
const YtIcon = () => (
	<svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
		<title>YouTube</title>
		<path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5 3-5 3z" />
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
			<h3 className="text-[11px] tracking-[0.24em] uppercase font-bold text-yns-ink">Shop</h3>
			<ul className="mt-5 space-y-3">
				<li>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="text-sm text-yns-ink/65 hover:text-yns-ink transition-colors"
					>
						All Products
					</YnsLink>
				</li>
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-yns-ink/65 hover:text-yns-ink transition-colors"
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
			<h3 className="text-[11px] tracking-[0.24em] uppercase font-bold text-yns-ink">Fine Print</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-yns-ink/65 hover:text-yns-ink transition-colors"
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
		<footer className="bg-yns-cream border-t border-yns-pink-soft/60">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-2 md:grid-cols-5 gap-10">
					{/* Brand */}
					<div className="col-span-2 md:col-span-2 md:max-w-sm">
						<YnsLink prefetch={"eager"} href="/" className="yns-logo text-3xl text-yns-ink tracking-wider">
							YNS
						</YnsLink>
						<p className="mt-5 text-sm text-yns-ink/70 leading-relaxed">
							Your Next Store. Premium haircare formulas, bottled with the obsession of an editorial salon and
							the rigor of clinical chemistry.
						</p>
						<div className="mt-6 flex items-center gap-3">
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noreferrer"
								className="h-10 w-10 rounded-full bg-yns-pink hover:bg-yns-pink/80 flex items-center justify-center transition"
								aria-label="Instagram"
							>
								<IgIcon />
							</a>
							<a
								href="https://tiktok.com"
								target="_blank"
								rel="noreferrer"
								className="h-10 w-10 rounded-full bg-yns-lavender hover:bg-yns-lavender/80 flex items-center justify-center transition"
								aria-label="TikTok"
							>
								<TiktokIcon />
							</a>
							<a
								href="https://youtube.com"
								target="_blank"
								rel="noreferrer"
								className="h-10 w-10 rounded-full bg-yns-pink-soft hover:bg-yns-pink-soft/80 flex items-center justify-center transition"
								aria-label="YouTube"
							>
								<YtIcon />
							</a>
						</div>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Support */}
					<div>
						<h3 className="text-[11px] tracking-[0.24em] uppercase font-bold text-yns-ink">Support</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-yns-ink/65 hover:text-yns-ink transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-yns-ink/65 hover:text-yns-ink transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/#about"
									className="text-sm text-yns-ink/65 hover:text-yns-ink transition-colors"
								>
									Our Story
								</YnsLink>
							</li>
							<li>
								<a
									href="mailto:hello@yournextstore.com"
									className="text-sm text-yns-ink/65 hover:text-yns-ink transition-colors"
								>
									hello@yns.com
								</a>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					{/* Legal */}
					<FooterLegalPages />
				</div>

				{/* Bottom bar */}
				<div className="py-7 border-t border-yns-pink-soft/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<p className="text-[11px] tracking-[0.18em] uppercase text-yns-ink/55">
						© {new Date().getFullYear()} Your Next Store · Bottled with care
					</p>
					<p className="text-[11px] tracking-[0.18em] uppercase text-yns-ink/55">
						Free shipping on orders over $75
					</p>
				</div>
			</div>
		</footer>
	);
}
