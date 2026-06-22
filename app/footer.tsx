import { Camera, Mail } from "lucide-react";
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
			<Link href="/blog" className="text-sm text-background/80 hover:text-background transition-colors">
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
			<Link href="/contact" className="text-sm text-background/80 hover:text-background transition-colors">
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
			<h3 className="text-xs tracking-[0.22em] uppercase text-muted-foreground">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-foreground/80 hover:text-foreground transition-colors"
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
			<h3 className="text-xs tracking-[0.22em] uppercase text-muted-foreground">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-foreground/80 hover:text-foreground transition-colors"
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
		<footer className="bg-foreground text-background mt-20">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-20 pb-10">
				{/* Big display word */}
				<p className="yns-display text-background/95 leading-[0.85] tracking-[-0.04em] text-[18vw] sm:text-[14vw] lg:text-[12vw] font-medium">
					<span className="bg-gradient-to-b from-background to-background/30 bg-clip-text text-transparent">
						Your Next Store
					</span>
				</p>

				<div className="grid grid-cols-2 md:grid-cols-5 gap-10 mt-16">
					<div className="col-span-2 md:col-span-2 sm:max-w-sm">
						<Link href="/" className="yns-display text-2xl text-background">
							YNS
						</Link>
						<p className="mt-4 text-sm text-background/70 leading-relaxed">
							A small studio designing objects for slow, considered homes. Built since 2018 in collaboration
							with 112 independent makers.
						</p>
						<div className="mt-6 flex items-center gap-3">
							<a
								href="https://instagram.com"
								className="inline-flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-background/20 hover:bg-background/10 transition-colors"
								aria-label="Instagram"
							>
								<Camera className="h-4 w-4" />
							</a>
							<a
								href="mailto:hello@yournextstore.com"
								className="inline-flex h-10 items-center gap-2 rounded-full ring-1 ring-background/20 hover:bg-background/10 transition-colors px-4 text-sm"
							>
								<Mail className="h-4 w-4" />
								hello@yournextstore.com
							</a>
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-xs tracking-[0.22em] uppercase text-background/50">Support</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<Link
									href="/about"
									className="text-sm text-background/80 hover:text-background transition-colors"
								>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link
									href="/faq"
									className="text-sm text-background/80 hover:text-background transition-colors"
								>
									FAQ
								</Link>
							</li>
							<li>
								<Link
									href="/cart"
									className="text-sm text-background/80 hover:text-background transition-colors"
								>
									Returns
								</Link>
							</li>
							<li>
								<a
									href="mailto:care@yournextstore.com"
									className="text-sm text-background/80 hover:text-background transition-colors"
								>
									Contact us
								</a>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				{/* Bottom bar */}
				<div className="mt-16 pt-6 border-t border-background/10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-xs text-background/50">&copy; {year} Your Next Store. All rights reserved.</p>
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
						<PaymentMethods />
						<p className="text-xs text-background/50 tracking-[0.18em] uppercase">
							Designed quietly · Made to last
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
