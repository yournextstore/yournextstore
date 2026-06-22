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

	const collections = await commerce.collectionBrowse({ limit: 6 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
			<h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
		<footer className="border-t border-border bg-background">
			<div className="mx-auto max-w-[1440px] px-6 lg:px-12">
				<div className="grid grid-cols-2 gap-10 py-16 sm:grid-cols-3 lg:grid-cols-5 lg:gap-12 lg:py-20">
					<div className="col-span-2 lg:col-span-2 lg:max-w-xs">
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-display text-xl tracking-[0.28em] uppercase text-foreground"
						>
							Your Next Store
						</YnsLink>
						<p className="mt-5 text-sm leading-relaxed text-muted-foreground">
							A destination for considered designer fashion — curated by the YNS atelier, shipped from
							Antwerp.
						</p>
						<div className="mt-6 flex items-center gap-3 text-muted-foreground">
							{["Instagram", "Pinterest", "TikTok", "YouTube"].map((label) => (
								<a
									key={label}
									href="#"
									className="text-[11px] uppercase tracking-[0.22em] hover:text-foreground transition-colors"
								>
									{label[0]}
								</a>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground">Support</h3>
						<ul className="mt-5 space-y-3">
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
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									Frequently Asked
								</YnsLink>
							</li>
							<li>
								<a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
									Shipping & Returns
								</a>
							</li>
							<li>
								<a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
									Size Guide
								</a>
							</li>
							<li>
								<a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
									Personal Styling
								</a>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="flex flex-col gap-3 border-t border-border py-6 text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
					<p>&copy; {new Date().getFullYear()} Your Next Store. Curated in Antwerp. All rights reserved.</p>
					<p>Worldwide express shipping · EUR · USD · GBP</p>
				</div>
			</div>
		</footer>
	);
}
