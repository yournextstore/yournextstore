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
				className="text-sm text-cream/80 transition-colors hover:text-cream"
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
				className="text-sm text-cream/80 transition-colors hover:text-cream"
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
			<h3 className="eyebrow text-cream/60">Shop</h3>
			<ul className="mt-6 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-cream/80 transition-colors hover:text-cream"
						>
							{collection.name}
						</YnsLink>
					</li>
				))}
				<li>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="text-sm text-cream/80 transition-colors hover:text-cream"
					>
						All Products
					</YnsLink>
				</li>
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
			<h3 className="eyebrow text-cream/60">Legal</h3>
			<ul className="mt-6 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-cream/80 transition-colors hover:text-cream"
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
		<footer className="bg-ink text-cream">
			<div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
				<div className="grid grid-cols-1 gap-12 py-16 sm:py-20 md:grid-cols-12">
					{/* Brand */}
					<div className="md:col-span-4">
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-display text-2xl tracking-[0.32em] text-cream"
						>
							YOUR NEXT STORE
						</YnsLink>
						<p className="mt-6 max-w-xs text-sm leading-relaxed text-cream/60">
							Performance beauty engineered for the way you actually live. Sweat-proof, transfer-resistant,
							unapologetically you.
						</p>
						<div className="mt-8 flex items-center gap-4 text-cream/60">
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-cream"
							>
								<span className="eyebrow">Instagram</span>
							</a>
							<span className="text-cream/30">·</span>
							<a
								href="https://tiktok.com"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-cream"
							>
								<span className="eyebrow">TikTok</span>
							</a>
							<span className="text-cream/30">·</span>
							<a
								href="https://youtube.com"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-cream"
							>
								<span className="eyebrow">YouTube</span>
							</a>
						</div>
					</div>

					{/* Columns */}
					<div className="md:col-span-2">
						<FooterCollections />
					</div>

					<div className="md:col-span-2">
						<h3 className="eyebrow text-cream/60">Support</h3>
						<ul className="mt-6 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-cream/80 transition-colors hover:text-cream"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-cream/80 transition-colors hover:text-cream"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<a
									href="mailto:hello@yournextstore.com"
									className="text-sm text-cream/80 transition-colors hover:text-cream"
								>
									Contact
								</a>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-cream/80 transition-colors hover:text-cream"
								>
									Shipping
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-cream/80 transition-colors hover:text-cream"
								>
									Returns
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<div className="md:col-span-2">
						<FooterLegalPages />
					</div>

					<div className="md:col-span-2">
						<h3 className="eyebrow text-cream/60">Studio</h3>
						<ul className="mt-6 space-y-3">
							<li>
								<YnsLink prefetch={"eager"} href="#about" className="text-sm text-cream/80 hover:text-cream">
									About
								</YnsLink>
							</li>
							<li>
								<YnsLink prefetch={"eager"} href="#impact" className="text-sm text-cream/80 hover:text-cream">
									Impact
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-cream/80 hover:text-cream"
								>
									Press
								</YnsLink>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="flex flex-col items-start justify-between gap-3 border-t border-cream/15 py-6 text-xs text-cream/45 sm:flex-row sm:items-center">
					<p>&copy; {new Date().getFullYear()} Your Next Store. All rights reserved.</p>
					<p className="eyebrow">Made with intention · Brooklyn / Paris</p>
				</div>
			</div>
		</footer>
	);
}
