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
				className="text-sm text-foreground/70 hover:text-foreground transition-colors"
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
				className="text-sm text-foreground/70 hover:text-foreground transition-colors"
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
			<h3 className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground">Collections</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-foreground/70 hover:text-foreground transition-colors"
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
			<h3 className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-foreground/70 hover:text-foreground transition-colors"
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
		<footer className="border-t border-border/60 bg-background">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
				<div className="py-16 sm:py-20 grid grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-12">
					{/* Brand */}
					<div className="col-span-2">
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-serif text-3xl tracking-tight text-foreground"
						>
							Your Next Store
						</YnsLink>
						<p className="mt-5 text-sm text-foreground/65 leading-relaxed max-w-xs">
							Rooted in care, community, and intention. Salon-inspired rituals for texture-rich hair.
						</p>
						<div className="mt-6 flex items-center gap-3 text-foreground/60">
							{["Instagram", "TikTok", "Pinterest"].map((label) => (
								<span
									key={label}
									title={label}
									className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:border-foreground/50 hover:text-foreground transition-colors"
								>
									<span className="text-[10px] font-medium tracking-[0.14em] uppercase">
										{label.charAt(0)}
									</span>
								</span>
							))}
						</div>
					</div>

					{/* Shop */}
					<div>
						<h3 className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground">Shop</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-foreground/70 hover:text-foreground transition-colors"
								>
									All Rituals
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/search"
									className="text-sm text-foreground/70 hover:text-foreground transition-colors"
								>
									Search
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Support + Legal */}
					<div className="space-y-10">
						<div>
							<h3 className="text-[10px] font-semibold tracking-[0.28em] uppercase text-foreground">
								Support
							</h3>
							<ul className="mt-5 space-y-3">
								<li>
									<YnsLink
										prefetch={"eager"}
										href="/about"
										className="text-sm text-foreground/70 hover:text-foreground transition-colors"
									>
										About Us
									</YnsLink>
								</li>
								<FooterContactLink />
								<li>
									<YnsLink
										prefetch={"eager"}
										href="/faq"
										className="text-sm text-foreground/70 hover:text-foreground transition-colors"
									>
										FAQ
									</YnsLink>
								</li>
							</ul>
						</div>
						<FooterLegalPages />
					</div>
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
					<p className="text-xs text-foreground/60">
						© {new Date().getFullYear()} Your Next Store. Rooted in care.
					</p>
					<p className="text-[10px] font-medium tracking-[0.28em] uppercase text-foreground/55">
						Celebrate Your Texture
					</p>
				</div>
			</div>
		</footer>
	);
}
