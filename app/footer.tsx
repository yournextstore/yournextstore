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
				className="text-sm text-cream/60 hover:text-lime transition-colors"
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
				className="text-sm text-cream/60 hover:text-lime transition-colors"
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
			<h3 className="text-sm font-display font-semibold text-cream mb-5">Shop departments</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-cream/60 hover:text-lime transition-colors"
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
			<h3 className="text-sm font-display font-semibold text-cream mb-5">Legal</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-cream/60 hover:text-lime transition-colors"
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
		<footer className="bg-forest-deep text-cream">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Marquee strip */}
				<div className="border-b border-cream/10 py-5 overflow-hidden">
					<div className="flex gap-12 whitespace-nowrap animate-marquee">
						{[
							"🌿 Certified organic",
							"⚡ 30-min delivery",
							"♻️ Zero-waste packaging",
							"🚜 Family-run farms",
							"🤝 Fair trade certified",
							"🥖 Fresh-baked daily",
							"🌿 Certified organic",
							"⚡ 30-min delivery",
							"♻️ Zero-waste packaging",
							"🚜 Family-run farms",
							"🤝 Fair trade certified",
							"🥖 Fresh-baked daily",
						].map((item, i) => (
							<span
								key={`marquee-${i}`}
								className="text-sm font-medium text-cream/70 flex items-center gap-12"
							>
								{item}
							</span>
						))}
					</div>
				</div>

				<div className="py-14 grid grid-cols-2 md:grid-cols-5 gap-8">
					<div className="col-span-2">
						<YnsLink prefetch={"eager"} href="/" className="inline-flex items-center gap-2">
							<svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<title>YNS leaf</title>
								<path
									d="M3 21C3 21 4 12 12 8C18 5 21 3 21 3C21 3 20 13 13 17C7.5 20 3 21 3 21Z"
									fill="#C6F26D"
								/>
							</svg>
							<span className="font-display text-xl font-semibold">Your Next Store</span>
						</YnsLink>
						<p className="mt-4 text-sm text-cream/60 leading-relaxed max-w-xs">
							Farm-fresh groceries, milled grains and artisan pantry staples — delivered with care from
							growers we trust.
						</p>
						<div className="mt-6 flex gap-3">
							{["X", "IG", "TT", "YT"].map((label) => (
								<a
									key={label}
									href="/"
									aria-label={label}
									className="h-9 w-9 rounded-full bg-forest hover:bg-lime hover:text-forest-deep transition-colors flex items-center justify-center text-xs font-bold"
								>
									{label}
								</a>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-sm font-display font-semibold text-cream mb-5">Support</h3>
						<ul className="space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-cream/60 hover:text-lime transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-cream/60 hover:text-lime transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<a href="/" className="text-sm text-cream/60 hover:text-lime transition-colors">
									Delivery info
								</a>
							</li>
							<li>
								<a href="/" className="text-sm text-cream/60 hover:text-lime transition-colors">
									Returns
								</a>
							</li>
							<li>
								<a href="/" className="text-sm text-cream/60 hover:text-lime transition-colors">
									Contact us
								</a>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="py-6 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-3">
					<p className="text-xs text-cream/50">
						© {new Date().getFullYear()} Your Next Store. Sourced with love.
					</p>
					<p className="text-xs text-cream/50">USDA Organic · Fair Trade · B Corp pending</p>
				</div>
			</div>
		</footer>
	);
}
