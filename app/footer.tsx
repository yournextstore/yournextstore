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
			<Link href="/blog" className="font-serif text-bone/85 hover:text-bone text-base transition-colors">
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
			<Link href="/contact" className="font-serif text-bone/85 hover:text-bone text-base transition-colors">
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
			<h3 className="eyebrow text-bone/60 text-[0.65rem] mb-5">Shop</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="font-serif text-bone/85 hover:text-bone text-base transition-colors"
						>
							{collection.name}
						</Link>
					</li>
				))}
				<li>
					<Link
						href="/products"
						className="font-serif text-bone/85 hover:text-bone text-base transition-colors"
					>
						All Products
					</Link>
				</li>
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
			<h3 className="eyebrow text-bone/60 text-[0.65rem] mb-5">Legal</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="font-serif text-bone/85 hover:text-bone text-base transition-colors"
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
		<footer className="bg-ink text-bone">
			<div className="max-w-[1400px] mx-auto px-6 sm:px-10 pt-20 pb-10">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-10">
					<div className="col-span-2 md:col-span-1">
						<Link href="/" className="font-serif text-2xl tracking-[0.18em] text-bone">
							YOUR NEXT STORE
						</Link>
						<p className="mt-5 font-serif italic text-bone/65 text-base leading-relaxed max-w-xs">
							Intimate by nature. Intuitive by design. Made slowly, in small batches.
						</p>
					</div>

					<FooterCollections />

					<div>
						<h3 className="eyebrow text-bone/60 text-[0.65rem] mb-5">Atelier</h3>
						<ul className="space-y-3">
							<li>
								<Link
									href="#about"
									className="font-serif text-bone/85 hover:text-bone text-base transition-colors"
								>
									About
								</Link>
							</li>
							<li>
								<Link
									href="#muses"
									className="font-serif text-bone/85 hover:text-bone text-base transition-colors"
								>
									Muses
								</Link>
							</li>
							<li>
								<Link
									href="/about"
									className="font-serif text-bone/85 hover:text-bone text-base transition-colors"
								>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link
									href="/faq"
									className="font-serif text-bone/85 hover:text-bone text-base transition-colors"
								>
									Stockists
								</Link>
							</li>
							<li>
								<Link
									href="/faq"
									className="font-serif text-bone/85 hover:text-bone text-base transition-colors"
								>
									FAQ
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="mt-20 pt-8 border-t border-bone/15">
					<p className="font-serif italic text-clay/80 text-center text-3xl sm:text-5xl tracking-[0.25em] mb-8">
						Y&nbsp;·&nbsp;N&nbsp;·&nbsp;S
					</p>
					<PaymentMethods className="mb-8 justify-center" />
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<p className="eyebrow text-bone/45 text-[0.6rem]">
							&copy; {year} Your Next Store — All Rights Reserved
						</p>
						<p className="eyebrow text-bone/45 text-[0.6rem]">Made slowly · Shipped warmly · Worldwide</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
