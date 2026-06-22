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
				className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
				className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
			<h3 className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Catalog</h3>
			<ul className="mt-4 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-foreground/80 hover:text-primary transition-colors"
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
			<h3 className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Legal</h3>
			<ul className="mt-4 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-foreground/80 hover:text-primary transition-colors"
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
		<footer className="relative border-t border-border bg-[#0a090c]">
			<div
				aria-hidden="true"
				className="absolute inset-x-0 -top-px h-px"
				style={{
					background:
						"linear-gradient(90deg, transparent, rgba(217,70,196,0.6), rgba(168,85,247,0.6), transparent)",
				}}
			/>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
					{/* Brand */}
					<div className="col-span-2 lg:col-span-2 max-w-xs">
						<YnsLink prefetch={"eager"} href="/" className="flex items-center gap-2.5">
							<span className="diamond-mark" aria-hidden="true" />
							<span className="font-display text-base font-semibold text-foreground tracking-tight">
								/yournextstore<span className="text-primary">.</span>
							</span>
						</YnsLink>
						<p className="mt-5 text-sm text-muted-foreground leading-relaxed">
							Custom gaming PCs, curated components, and gear engineered for serious players. Hand-built in
							California since 2019.
						</p>
						<div className="mt-6 flex items-center gap-2">
							<span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
								<span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
								<span className="text-[11px] text-muted-foreground">All systems shipping</span>
							</span>
						</div>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Support */}
					<div>
						<h3 className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Support</h3>
						<ul className="mt-4 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-foreground/80 hover:text-primary transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-foreground/80 hover:text-primary transition-colors"
								>
									Track order
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-foreground/80 hover:text-primary transition-colors"
								>
									Warranty
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					{/* Legal */}
					<FooterLegalPages />
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
					<p className="text-xs text-muted-foreground">
						© {new Date().getFullYear()} Your Next Store. Built for performance.
					</p>
					<p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
						Shipping worldwide · USD
					</p>
				</div>
			</div>
		</footer>
	);
}
