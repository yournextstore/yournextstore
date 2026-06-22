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
				className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
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
				className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
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
			<h3 className="text-xs font-normal tracking-[0.2em] uppercase text-primary-foreground mb-6">
				Collections
			</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
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
			<h3 className="text-xs font-normal tracking-[0.2em] uppercase text-primary-foreground mb-6">Info</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
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
		<footer className="bg-foreground text-primary-foreground">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
					{/* About */}
					<div>
						<h3 className="text-xs font-normal tracking-[0.2em] uppercase text-primary-foreground mb-6">
							About
						</h3>
						<p className="text-sm text-primary-foreground/60 leading-relaxed">
							Simple, beautiful objects that combine form and function. Curated essentials for modern living.
						</p>
					</div>

					{/* Info */}
					<FooterLegalPages />

					{/* Collections */}
					<FooterCollections />

					{/* Newsletter */}
					<div>
						<h3 className="text-xs font-normal tracking-[0.2em] uppercase text-primary-foreground mb-6">
							Newsletter
						</h3>
						<p className="text-sm text-primary-foreground/60 leading-relaxed">
							Stay up to date on the latest product releases and special offers.
						</p>
						<ul className="mt-6 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-primary-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-xs text-primary-foreground/40">
						&copy; {new Date().getFullYear()} Your Next Store. All rights reserved.
					</p>
					<YnsLink
						prefetch={"eager"}
						href="/"
						className="font-heading text-lg font-light tracking-[0.15em] uppercase text-primary-foreground"
					>
						YNS
					</YnsLink>
				</div>
			</div>
		</footer>
	);
}
