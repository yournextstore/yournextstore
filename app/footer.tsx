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
				className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
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
				className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
			>
				Contact Us
			</YnsLink>
		</li>
	);
}

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 6 });

	if (collections.data.length === 0) {
		return (
			<div>
				<h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">Shop</h3>
				<ul className="mt-5 space-y-3">
					{["New", "Bras", "Briefs", "Lingerie", "Sleepwear"].map((label) => (
						<li key={label}>
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
							>
								{label}
							</YnsLink>
						</li>
					))}
				</ul>
			</div>
		);
	}

	return (
		<div>
			<h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
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
			<h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
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
		<footer className="border-t border-border bg-[#f5ede2]">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-2 gap-10 py-16 sm:grid-cols-3 sm:gap-12 lg:grid-cols-5 lg:py-20">
					{/* Brand */}
					<div className="col-span-2 sm:col-span-3 lg:col-span-2">
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-display text-[28px] tracking-[0.04em] text-foreground"
							style={{ fontFamily: "var(--font-cormorant)" }}
						>
							Your Next Store
						</YnsLink>
						<p className="mt-5 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
							Soft-luxe intimates and lingerie — heirloom lace, second-skin comfort and ethically made.
						</p>
						<div className="mt-6 flex items-center gap-3">
							{["Instagram", "TikTok", "Pinterest"].map((label) => (
								<a
									key={label}
									href="#"
									className="text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/70 hover:text-foreground"
								>
									{label}
								</a>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">Help</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<a
									href="#"
									className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
								>
									Shipping & Returns
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
								>
									Size Guide
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
								>
									Contact
								</a>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				{/* Bottom bar */}
				<div className="flex flex-col gap-4 border-t border-foreground/10 py-6 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-4">
						<select className="rounded-full border border-foreground/15 bg-transparent px-4 py-1.5 text-[11px] uppercase tracking-[0.16em] text-foreground/80">
							<option>AUD $</option>
							<option>USD $</option>
							<option>EUR €</option>
							<option>GBP £</option>
						</select>
						<div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-foreground/60">
							{["Visa", "Mastercard", "Amex", "PayPal", "Klarna"].map((p) => (
								<span
									key={p}
									className="rounded-sm border border-foreground/10 bg-white px-2 py-1 text-foreground/70"
								>
									{p}
								</span>
							))}
						</div>
					</div>
					<p className="text-[11px] uppercase tracking-[0.16em] text-foreground/60">
						© {new Date().getFullYear()} Your Next Store. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
