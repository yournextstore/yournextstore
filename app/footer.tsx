import { cacheLife } from "next/cache";
import { YnsLink } from "@/components/yns-link";
import { commerce, meGetCached } from "@/lib/commerce";
import { previewHref } from "@/lib/demo-products";

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
				className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
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
				className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
			>
				Contact Us
			</YnsLink>
		</li>
	);
}

async function FooterCollections({ preview }: { preview: boolean }) {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="text-[11px] tracking-luxe uppercase text-[#8b6b4a] mb-5">Collections</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={previewHref(`/collection/${collection.slug}`, preview)}
							className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
						>
							{collection.name}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

async function FooterLegalPages({ preview }: { preview: boolean }) {
	"use cache";
	cacheLife("hours");

	const pages = await commerce.legalPageBrowse();

	if (pages.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="text-[11px] tracking-luxe uppercase text-[#8b6b4a] mb-5">Legal</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={previewHref(`/legal${page.href}`, preview)}
							className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
						>
							{page.label}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

export function Footer({ preview = false }: { preview?: boolean }) {
	return (
		<footer className="bg-cream-grain border-t border-[#e8dcc8]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-20 grid grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16">
					{/* Brand */}
					<div className="col-span-2 max-w-sm">
						<YnsLink
							prefetch={"eager"}
							href={previewHref("/", preview)}
							className="font-serif text-2xl text-foreground"
						>
							Your Next Store
						</YnsLink>
						<p className="mt-5 text-sm text-muted-foreground leading-[1.85] font-light">
							Hand-poured fragrance and quiet rituals for the home. Made in small batches with single-origin
							oils, traceable wax, and the patience of an old craft.
						</p>
						<div className="mt-6 flex items-center gap-3 text-[10px] tracking-luxe uppercase text-muted-foreground">
							<span>Free shipping over $120</span>
							<span className="opacity-30">·</span>
							<span>30-day returns</span>
						</div>
					</div>

					<FooterCollections preview={preview} />

					<div>
						<h3 className="text-[11px] tracking-luxe uppercase text-[#8b6b4a] mb-5">Maison</h3>
						<ul className="space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href={previewHref("/#story", preview)}
									className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
								>
									Our Story
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href={previewHref("/faq", preview)}
									className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
								>
									Journal
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href={previewHref("/faq", preview)}
									className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
								>
									Care Guide
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages preview={preview} />
				</div>

				{/* Bottom bar */}
				<div className="py-8 border-t border-[#e8dcc8] flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-[10px] tracking-luxe uppercase text-muted-foreground">
						&copy; {new Date().getFullYear()} Your Next Store · Hand-poured in small batches
					</p>
					<div className="flex items-center gap-5 text-[10px] tracking-luxe uppercase text-muted-foreground">
						<span>Visa</span>
						<span>Mastercard</span>
						<span>Amex</span>
						<span>Apple Pay</span>
					</div>
				</div>
			</div>
		</footer>
	);
}
