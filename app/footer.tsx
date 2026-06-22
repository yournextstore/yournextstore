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
			<Link href="/blog" className="text-sm text-cream/70 hover:text-cream transition-colors">
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
			<Link href="/contact" className="text-sm text-cream/70 hover:text-cream transition-colors">
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
			<h3 className="font-display tracking-[0.24em] text-xs text-bronze-light mb-5">SHOP</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-cream/70 hover:text-cream transition-colors"
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
			<h3 className="font-display tracking-[0.24em] text-xs text-bronze-light mb-5">LEGAL</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-cream/70 hover:text-cream transition-colors"
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
		<footer className="bg-espresso border-t border-bronze/20">
			<div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-10 sm:gap-12">
					<div className="col-span-2 sm:col-span-4 lg:col-span-2 lg:max-w-sm">
						<div className="flex flex-col leading-none mb-5">
							<span className="font-display text-3xl sm:text-4xl text-cream tracking-tight">YOUR NEXT</span>
							<span className="font-display text-xs tracking-[0.32em] text-bronze-light mt-1">STORE</span>
						</div>
						<p className="text-sm text-cream/60 leading-relaxed mb-6 max-w-xs">
							Whole-food protein bars, pressed fresh in Oakland. Honest fuel for everyday miles.
						</p>
						<div className="flex gap-3">
							{["IG", "TT", "YT"].map((s) => (
								<a
									key={s}
									href={`https://${s.toLowerCase()}.com`}
									className="h-9 w-9 flex items-center justify-center border border-cream/15 text-cream/60 text-xs font-display tracking-wider hover:border-bronze-light hover:text-bronze-light transition-colors"
								>
									{s}
								</a>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="font-display tracking-[0.24em] text-xs text-bronze-light mb-5">SUPPORT</h3>
						<ul className="space-y-3">
							<li>
								<Link href="/about" className="text-sm text-cream/70 hover:text-cream transition-colors">
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link href="/faq" className="text-sm text-cream/70 hover:text-cream transition-colors">
									FAQ
								</Link>
							</li>
							<li>
								<Link href="/products" className="text-sm text-cream/70 hover:text-cream transition-colors">
									All Products
								</Link>
							</li>
							<li>
								<Link href="/search" className="text-sm text-cream/70 hover:text-cream transition-colors">
									Search
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>
			</div>

			<div className="bg-bronze-gradient text-espresso">
				<div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
					<p className="text-[11px] sm:text-xs font-bold tracking-[0.18em] uppercase">
						© {year} Your Next Store — Press On.
					</p>
					{/* Official marks sit on a cream chip so they stay legible on the bronze bar. */}
					<PaymentMethods className="bg-cream rounded-sm px-2 py-1" />
					<p className="text-[11px] sm:text-xs font-bold tracking-[0.18em] uppercase">
						Pressed Fresh · Oakland, CA
					</p>
				</div>
			</div>
		</footer>
	);
}
