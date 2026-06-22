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
				className="text-sm text-cream/85 hover:text-cream transition-colors"
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
				className="text-sm text-cream/85 hover:text-cream transition-colors"
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
			<h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-cream/60">Collections</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-cream/85 hover:text-cream transition-colors"
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
			<h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-cream/60">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-cream/85 hover:text-cream transition-colors"
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
		<footer className="relative bg-brand text-brand-foreground overflow-hidden">
			{/* Decorative SVG */}
			<svg
				aria-hidden="true"
				viewBox="0 0 1200 400"
				className="absolute inset-0 h-full w-full opacity-10 mix-blend-screen"
				preserveAspectRatio="xMidYMid slice"
			>
				<defs>
					<radialGradient id="footer-glow" cx="80%" cy="0%" r="60%">
						<stop offset="0%" stopColor="#d4c5a9" stopOpacity="0.6" />
						<stop offset="100%" stopColor="#0e4f3f" stopOpacity="0" />
					</radialGradient>
				</defs>
				<rect width="1200" height="400" fill="url(#footer-glow)" />
			</svg>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Big brand mark */}
				<div className="pt-16 pb-10 border-b border-cream/15">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
						<div>
							<p className="text-xs uppercase tracking-[0.3em] text-cream/60">Your Next Store</p>
							<p className="mt-4 font-display text-4xl sm:text-5xl leading-tight text-cream max-w-md">
								Everything tiny humans need,
								<br />
								<span className="italic text-sand">in one warm place.</span>
							</p>
						</div>
						<div className="md:justify-self-end">
							<form className="flex flex-col sm:flex-row gap-3 max-w-md">
								<input
									type="email"
									placeholder="Your email address"
									className="h-12 flex-1 rounded-full border border-cream/20 bg-cream/5 px-5 text-sm text-cream placeholder:text-cream/50 outline-none focus:border-cream/40 focus:ring-2 focus:ring-cream/10"
								/>
								<button
									type="submit"
									className="h-12 px-7 rounded-full bg-cream text-brand text-sm font-semibold hover:bg-white transition-colors"
								>
									Subscribe
								</button>
							</form>
							<p className="mt-3 text-xs text-cream/60">Join 12,000+ parents on our weekly nursery letter.</p>
						</div>
					</div>
				</div>

				<div className="py-12 sm:py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
					{/* Brand */}
					<div className="col-span-2 md:col-span-1">
						<YnsLink prefetch={"eager"} href="/" className="font-display text-2xl text-cream">
							<span className="inline-flex items-center gap-2">
								<span className="inline-block h-2.5 w-2.5 rounded-full bg-sand" />
								Your Next Store
							</span>
						</YnsLink>
						<p className="mt-4 text-sm text-cream/70 leading-relaxed max-w-xs">
							Curated baby essentials for modern families. Soft on skin, gentle on the planet.
						</p>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-cream/60">Support</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-cream/85 hover:text-cream transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-cream/85 hover:text-cream transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<a
									href="mailto:hello@yournextstore.com"
									className="text-sm text-cream/85 hover:text-cream transition-colors"
								>
									Contact
								</a>
							</li>
							<li>
								<a
									href="tel:+13664646242"
									className="text-sm text-cream/85 hover:text-cream transition-colors"
								>
									+1 (366) 464-6242
								</a>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="py-6 border-t border-cream/15 flex flex-col sm:flex-row items-center justify-between gap-3">
					<p className="text-xs text-cream/60">
						&copy; {new Date().getFullYear()} Your Next Store · All rights reserved.
					</p>
					<p className="text-xs text-cream/60">Made with care for little ones.</p>
				</div>
			</div>
		</footer>
	);
}
