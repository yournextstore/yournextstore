import { AtSign, Camera, Globe, Send } from "lucide-react";
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
			<Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
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
			<Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
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
			<h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-[--ink]">
				Collections
			</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-[--ink]/65 hover:text-[--ember] transition-colors"
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
			<h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-[--ink]">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-[--ink]/65 hover:text-[--ember] transition-colors"
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
		<footer className="relative border-t border-[--ink]/10 bg-[#fffaf3]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-14 sm:py-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10">
					<div className="col-span-2 lg:col-span-2 sm:max-w-sm">
						<Link href="/" className="inline-flex items-center gap-2">
							<span aria-hidden className="relative flex h-9 w-9 items-center justify-center">
								<span className="absolute inset-0 rounded-full bg-sunset" />
								<span className="absolute inset-[3px] rounded-full bg-[#fffaf3]" />
								<span className="relative font-display text-base font-bold text-[--ink]">Y</span>
							</span>
							<span className="font-display text-xl font-semibold tracking-tight text-[--ink]">
								Your Next <span className="italic text-[--ember]">Store</span>
							</span>
						</Link>
						<p className="mt-5 text-sm text-[--ink]/65 leading-relaxed max-w-xs">
							Curated essentials, premium fabrics, and modern pieces that wear their age well.
						</p>

						<form className="mt-6 flex max-w-sm items-center gap-2">
							<input
								type="email"
								placeholder="your@email.com"
								aria-label="Email"
								className="flex-1 h-11 rounded-full bg-white px-4 text-sm text-[--ink] placeholder:text-[--ink]/35 ring-1 ring-[--ink]/10 outline-none focus:ring-[--ember]/50"
							/>
							<button
								type="button"
								className="grid place-items-center h-11 w-11 rounded-full bg-[--ember] text-white hover:bg-[--ink] transition-colors"
								aria-label="Subscribe"
							>
								<Send className="h-4 w-4" />
							</button>
						</form>

						<div className="mt-6 flex items-center gap-2">
							{[Camera, AtSign, Globe].map((Icon, idx) => (
								<button
									key={`social-${idx}`}
									type="button"
									className="grid place-items-center h-10 w-10 rounded-full bg-white ring-1 ring-[--ink]/10 text-[--ink]/75 hover:bg-[--ember] hover:text-white hover:ring-[--ember] transition-all"
									aria-label="Social link"
								>
									<Icon className="h-4 w-4" />
								</button>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-[--ink]">
							Support
						</h3>
						<ul className="mt-5 space-y-3">
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
								<Link href="/faq" className="text-sm text-[--ink]/65 hover:text-[--ember] transition-colors">
									FAQ
								</Link>
							</li>
							<FooterBlogLink />
							<li>
								<a
									href="mailto:hello@yournext.store"
									className="text-sm text-[--ink]/65 hover:text-[--ember] transition-colors"
								>
									Contact
								</a>
							</li>
							<li>
								<Link
									href="/products"
									className="text-sm text-[--ink]/65 hover:text-[--ember] transition-colors"
								>
									Shipping & Returns
								</Link>
							</li>
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="py-6 border-t border-[--ink]/10 flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
					<p className="text-xs text-[--ink]/55">&copy; {year} Your Next Store. All rights reserved.</p>
					<p className="text-xs text-[--ink]/55">Crafted with intention. Shipped worldwide.</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
