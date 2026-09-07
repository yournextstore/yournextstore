import { cacheLife } from "next/cache";
import Link from "next/link";
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
			<Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
				Blog
			</Link>
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
			<Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
				Contact Us
			</Link>
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
			<h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-foreground mb-6">Shop</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-muted-foreground hover:text-primary transition-colors"
						>
							{collection.name}
						</Link>
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
			<h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-foreground mb-6">Legal</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-muted-foreground hover:text-primary transition-colors"
						>
							{page.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

// `new Date()` is an unstable value: now that the footer is part of the prerendered
// shell, reading it during the prerender is an error. Caching pins it to the entry.
async function getCopyrightYear() {
	"use cache";
	cacheLife("days");

	return new Date().getFullYear();
}

export async function Footer() {
	const year = await getCopyrightYear();

	return (
		<footer className="border-t border-border bg-secondary/30">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-14 sm:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
					{/* Brand */}
					<div className="sm:col-span-2 lg:col-span-1">
						<Link
							href="/"
							className="font-heading text-xl font-semibold tracking-wide uppercase text-foreground"
						>
							Your Next Store
						</Link>
						<p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
							We create safe, clean beauty products that really work and are designed to make you feel good.
						</p>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Company */}
					<div>
						<h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-foreground mb-6">
							Company
						</h3>
						<ul className="space-y-3">
							<li>
								<Link
									href="/about"
									className="text-sm text-muted-foreground hover:text-primary transition-colors"
								>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link
									href="/faq"
									className="text-sm text-muted-foreground hover:text-primary transition-colors"
								>
									FAQ
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					{/* Legal */}
					<FooterLegalPages />
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-xs text-muted-foreground tracking-wide">
						&copy; {year} Your Next Store. All rights reserved.
					</p>
					<div className="flex items-center gap-6">
						<span className="text-xs text-muted-foreground">Follow us</span>
						<div className="flex items-center gap-4">
							{["Instagram", "TikTok", "Pinterest"].map((social) => (
								<span
									key={social}
									className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
								>
									{social}
								</span>
							))}
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
