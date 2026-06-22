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
				className="text-sm text-foreground/65 hover:text-magenta transition-colors"
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
				className="text-sm text-foreground/65 hover:text-magenta transition-colors"
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
			<h3 className="text-[11px] font-semibold tracking-[0.22em] uppercase text-foreground">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-foreground/65 hover:text-magenta transition-colors"
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
			<h3 className="text-[11px] font-semibold tracking-[0.22em] uppercase text-foreground">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-foreground/65 hover:text-magenta transition-colors"
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
		<footer className="bg-cream border-t border-border/60">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 grid grid-cols-2 gap-y-12 gap-x-8 sm:grid-cols-4 lg:grid-cols-5">
					<div className="col-span-2 sm:col-span-4 lg:col-span-2 sm:max-w-sm">
						<YnsLink prefetch={"eager"} href="/" className="inline-flex flex-col">
							<span className="font-display text-3xl tracking-tight text-foreground leading-none">
								Your<span className="italic text-magenta">Next</span>Store
							</span>
							<span className="mt-1 text-[10px] uppercase tracking-[0.32em] text-foreground/60">body</span>
						</YnsLink>
						<p className="mt-5 text-sm text-foreground/65 leading-relaxed max-w-xs">
							Body-positive essentials, made to disappear under everything and stay put through anything.
						</p>
						<div className="mt-6 flex items-center gap-3">
							{["IG", "TT", "FB", "PIN"].map((handle) => (
								<a
									key={handle}
									href="/"
									className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white border border-border text-[10px] tracking-[0.14em] font-semibold text-foreground hover:bg-magenta hover:text-white hover:border-magenta transition-colors"
								>
									{handle}
								</a>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-[11px] font-semibold tracking-[0.22em] uppercase text-foreground">Help</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-foreground/65 hover:text-magenta transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-foreground/65 hover:text-magenta transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-foreground/65 hover:text-magenta transition-colors"
								>
									Fit Guide
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-foreground/65 hover:text-magenta transition-colors"
								>
									Shipping & Returns
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="py-6 border-t border-border/60 flex flex-col sm:flex-row gap-3 items-center justify-between">
					<p className="text-xs text-foreground/55">
						&copy; {new Date().getFullYear()} Your Next Store. Designed with love.
					</p>
					<p className="text-[10px] tracking-[0.28em] uppercase text-foreground/55">
						Skin-safe · Reusable · Body-positive
					</p>
				</div>
			</div>
		</footer>
	);
}
