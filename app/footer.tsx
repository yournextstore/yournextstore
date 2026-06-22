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
			<Link href="/blog" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
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
			<Link href="/contact" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
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
			<h3 className="text-xs font-bold uppercase tracking-wide text-foreground">Collections</h3>
			<ul className="mt-4 space-y-2">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-xs text-muted-foreground hover:text-foreground transition-colors"
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
			<h3 className="text-xs font-bold uppercase tracking-wide text-foreground">Legal</h3>
			<ul className="mt-4 space-y-2">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-xs text-muted-foreground hover:text-foreground transition-colors"
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
		<section className="grid grid-cols-12 grid-border-b md:border-b-0">
			{/* Left column with description text */}
			<div className="col-span-12 md:col-span-4 grid-border-r p-8 md:p-12 min-h-[200px] flex items-center">
				<p className="text-xs leading-relaxed opacity-70">
					Our Sneakers Are Renowned For Their Unparalleled Quality, Comfort, And Durability. Our Products Are
					Crafted Using High-Quality Materials And Cutting-Edge Technologies That Provide Optimal Cushioning,
					Ventilation, And Support For Your Feet Throughout The Day.
				</p>
			</div>

			{/* Middle column with support links */}
			<div className="col-span-12 md:col-span-4 grid-border-r p-8 md:p-12 hidden md:flex md:items-center">
				<ul className="space-y-2">
					<li>
						<Link
							href="/about"
							className="text-xs text-muted-foreground hover:text-foreground transition-colors"
						>
							About Us
						</Link>
					</li>
					<FooterContactLink />
					<li>
						<Link
							href="/faq"
							className="text-xs text-muted-foreground hover:text-foreground transition-colors"
						>
							FAQ
						</Link>
					</li>
					<FooterBlogLink />
				</ul>
			</div>

			{/* Right column: collections and legal pages */}
			<div className="col-span-12 md:col-span-4 p-8 md:p-12 space-y-8">
				<FooterCollections />
				<FooterLegalPages />
			</div>

			{/* Bottom bar */}
			<div className="col-span-12 border-t border-border p-6 md:px-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<p className="text-xs text-muted-foreground">&copy; {year} Your Next Store. All rights reserved.</p>
				<PaymentMethods />
			</div>
		</section>
	);
}
