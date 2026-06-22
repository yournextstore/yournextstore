import { cacheLife } from "next/cache";
import Link from "next/link";
import { FooterNewsletter } from "@/app/newsletter/footer-newsletter";
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
		<Link
			href="/blog"
			className="text-base text-[var(--color-on-tertiary)]/80 hover:text-[var(--color-on-tertiary)] transition-colors"
		>
			Blog
		</Link>
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
		<Link
			href="/contact"
			className="text-base text-[var(--color-on-tertiary)]/80 hover:text-[var(--color-on-tertiary)] transition-colors"
		>
			Contact Us
		</Link>
	);
}

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ active: true, limit: 5 });

	return (
		<div className="flex flex-col gap-3 md:pl-6">
			<h4 className="label-caps mb-2">Shop</h4>
			<Link
				href="/products"
				className="text-base text-[var(--color-on-tertiary)]/80 hover:text-[var(--color-on-tertiary)] transition-colors"
			>
				All Products
			</Link>
			{collections.data.map((collection) => (
				<Link
					key={collection.id}
					href={`/collection/${collection.slug}`}
					className="text-base text-[var(--color-on-tertiary)]/80 hover:text-[var(--color-on-tertiary)] transition-colors"
				>
					{collection.name}
				</Link>
			))}
		</div>
	);
}

async function FooterLegalPages() {
	"use cache";
	cacheLife("hours");

	const pages = await commerce.legalPageBrowse();

	return (
		<div className="flex flex-col gap-3 md:pl-6">
			<h4 className="label-caps mb-2">Support</h4>
			<Link
				href="/faq"
				className="text-base text-[var(--color-on-tertiary)]/80 hover:text-[var(--color-on-tertiary)] transition-colors"
			>
				FAQ
			</Link>
			{pages.data.map((page) => (
				<Link
					key={page.id}
					href={`/legal${page.href}`}
					className="text-base text-[var(--color-on-tertiary)]/80 hover:text-[var(--color-on-tertiary)] transition-colors"
				>
					{page.label}
				</Link>
			))}
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
	const [me, year] = await Promise.all([meGetCached(), getCopyrightYear()]);
	const storeName = (me.store.name || "Your Next Store").toLowerCase();

	return (
		<footer className="bg-[var(--color-tertiary)] text-[var(--color-on-tertiary)] border-t border-foreground">
			<div className="max-w-[1280px] mx-auto px-5 md:px-20 py-16 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-0 md:divide-x md:divide-[var(--color-on-tertiary)]/30">
				<div className="flex flex-col justify-between pr-6">
					<Link
						href="/"
						className="font-serif text-3xl uppercase tracking-tight leading-none mb-8 font-semibold"
					>
						{storeName}
					</Link>
					<div className="flex flex-col gap-3 mt-4">
						<Link
							href="/about"
							className="text-base text-[var(--color-on-tertiary)]/80 hover:text-[var(--color-on-tertiary)] transition-colors"
						>
							About Us
						</Link>
						<FooterContactLink />
						<FooterBlogLink />
					</div>
					<div className="mt-auto flex flex-col gap-4">
						<p className="text-sm opacity-80">
							&copy; {year} {storeName}. All rights reserved.
						</p>
						<PaymentMethods />
					</div>
				</div>

				<FooterCollections />
				<FooterLegalPages />

				<div className="flex flex-col gap-3 md:pl-6">
					<h4 className="label-caps mb-2">Newsletter</h4>
					<p className="text-base opacity-80 mb-2">Join our list for $10 off your first order.</p>
					<FooterNewsletter />
				</div>
			</div>
		</footer>
	);
}
