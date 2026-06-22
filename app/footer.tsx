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
			<Link
				href="/blog"
				className="text-sm font-semibold text-fizz-ink/80 hover:text-fizz-berry transition-colors"
			>
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
			<Link
				href="/contact"
				className="text-sm font-semibold text-fizz-ink/80 hover:text-fizz-berry transition-colors"
			>
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
			<h3 className="text-xs font-bold uppercase tracking-[0.25em] text-fizz-sky">Drinks</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm font-semibold text-fizz-ink/80 hover:text-fizz-berry transition-colors"
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
			<h3 className="text-xs font-bold uppercase tracking-[0.25em] text-fizz-sky">Fine Print</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm font-semibold text-fizz-ink/80 hover:text-fizz-berry transition-colors"
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
		<footer className="bg-fizz-yellow text-fizz-ink">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-2 sm:grid-cols-4 gap-10 gap-y-12">
					<div className="col-span-2">
						<p className="text-xs font-bold uppercase tracking-[0.3em] text-fizz-sky">Your Next Store</p>
						<p className="mt-4 text-base font-semibold text-fizz-ink/80 max-w-sm leading-relaxed">
							Five-times distilled spirits, purified still water, natural fruit. Crafted for the fizz-free
							era.
						</p>
						<div className="mt-6 flex items-center gap-3">
							{["Instagram", "TikTok", "Spotify"].map((s) => (
								<span
									key={s}
									className="inline-flex items-center justify-center h-10 px-4 rounded-full bg-fizz-ink text-fizz-yellow text-xs font-bold uppercase tracking-[0.18em] hover:bg-fizz-berry transition-colors"
								>
									{s}
								</span>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-xs font-bold uppercase tracking-[0.25em] text-fizz-sky">Help</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<Link
									href="/about"
									className="text-sm font-semibold text-fizz-ink/80 hover:text-fizz-berry transition-colors"
								>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link
									href="/faq"
									className="text-sm font-semibold text-fizz-ink/80 hover:text-fizz-berry transition-colors"
								>
									FAQ
								</Link>
							</li>
							<FooterBlogLink />
							<li>
								<Link
									href="/products"
									className="text-sm font-semibold text-fizz-ink/80 hover:text-fizz-berry transition-colors"
								>
									Stockists
								</Link>
							</li>
							<li>
								<Link
									href="/search"
									className="text-sm font-semibold text-fizz-ink/80 hover:text-fizz-berry transition-colors"
								>
									Search
								</Link>
							</li>
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				{/* Oversized wordmark */}
				<div className="border-t-2 border-fizz-ink/15 py-10 sm:py-12">
					<p
						aria-hidden="true"
						className="font-display uppercase text-fizz-ink leading-[0.85] tracking-[-0.02em] text-[clamp(3rem,15vw,12rem)] text-center"
					>
						YOUR NEXT STORE
					</p>
				</div>

				<div className="py-6 border-t-2 border-fizz-ink/15 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-between">
					<p className="text-xs font-bold uppercase tracking-[0.18em] text-fizz-ink/70">
						© {year} Your Next Store. All rights reserved.
					</p>
					<PaymentMethods />
					<p className="text-xs font-bold uppercase tracking-[0.18em] text-fizz-ink/70">
						Drink responsibly · 21+
					</p>
				</div>
			</div>
		</footer>
	);
}
