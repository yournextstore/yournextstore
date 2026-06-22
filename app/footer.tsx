import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
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
			<Link href="/blog" className="text-sm text-foreground hover:text-foreground/60 transition-colors">
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
			<Link href="/contact" className="text-sm text-foreground hover:text-foreground/60 transition-colors">
				Contact Us
			</Link>
		</li>
	);
}

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ active: true, limit: 5 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="text-[10px] font-bold tracking-[0.25em] uppercase text-foreground mb-5">Collections</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-foreground hover:text-foreground/60 transition-colors"
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
			<h3 className="text-[10px] font-bold tracking-[0.25em] uppercase text-foreground mb-5">Legal</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-foreground hover:text-foreground/60 transition-colors"
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
	const tickerItems = Array.from({ length: 14 }, () => "E-Commerce · Next Generation");

	return (
		<footer className="border-t-2 border-foreground bg-background">
			{/* Brutalist ticker */}
			<div className="bg-foreground text-background border-b-2 border-foreground overflow-hidden">
				<div className="yns-marquee py-4">
					{tickerItems.map((t, i) => (
						<span
							key={`fticker-${i}`}
							className="font-display uppercase text-[5vw] sm:text-[2.5vw] tracking-tight whitespace-nowrap text-background flex items-center gap-4"
						>
							{t}
							<span className="text-[#d4ff3a]">★</span>
						</span>
					))}
				</div>
			</div>

			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
				<div className="py-14 sm:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
					<div>
						<Link href="/" className="font-display text-2xl uppercase tracking-tight text-foreground">
							Your Next Store
						</Link>
						<p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
							A multi-brand storefront for the next generation of shoppers. Drops every week, built with you
							in mind.
						</p>
						<div className="mt-6 inline-flex items-center gap-2 yns-bg-lime border-2 border-foreground px-3 py-1.5 text-[10px] font-bold tracking-[0.25em] uppercase">
							<span className="h-1.5 w-1.5 rounded-full bg-foreground" />
							Online · Always Open
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-[10px] font-bold tracking-[0.25em] uppercase text-foreground mb-5">
							Support
						</h3>
						<ul className="space-y-3">
							<li>
								<Link
									href="/about"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link
									href="/faq"
									className="text-sm text-foreground hover:text-foreground/60 transition-colors"
								>
									FAQ
								</Link>
							</li>
							<li>
								<Link
									href="/products"
									className="text-sm text-foreground hover:text-foreground/60 transition-colors"
								>
									Shop All
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				{/* Bottom bar */}
				<div className="py-5 border-t-2 border-foreground flex flex-col gap-3 sm:flex-row sm:gap-6 sm:items-center sm:justify-between">
					<p className="text-xs font-bold tracking-[0.2em] uppercase text-foreground/70">
						&copy; {year} Your Next Store. All rights reserved.
					</p>
					<p className="text-xs font-bold tracking-[0.2em] uppercase text-foreground/70">
						Crafted in low gravity · Brutalist e-commerce
					</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
