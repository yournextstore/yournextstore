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
		return (
			<FooterColumn title="Shop">
				<FooterLink href="/products">All Products</FooterLink>
				<FooterLink href="/products?category=women">Women</FooterLink>
				<FooterLink href="/products?category=men">Men</FooterLink>
				<FooterLink href="/products?category=accessories">Accessories</FooterLink>
			</FooterColumn>
		);
	}

	return (
		<FooterColumn title="Collections">
			{collections.data.map((collection) => (
				<FooterLink key={collection.id} href={`/collection/${collection.slug}`}>
					{collection.name}
				</FooterLink>
			))}
		</FooterColumn>
	);
}

async function FooterLegalPages() {
	"use cache";
	cacheLife("hours");

	const pages = await commerce.legalPageBrowse();

	if (pages.data.length === 0) {
		return (
			<FooterColumn title="Legal">
				<FooterLink href="/legal/terms">Terms of Service</FooterLink>
				<FooterLink href="/legal/privacy">Privacy Policy</FooterLink>
			</FooterColumn>
		);
	}

	return (
		<FooterColumn title="Legal">
			{pages.data.map((page) => (
				<FooterLink key={page.id} href={`/legal${page.href}`}>
					{page.label}
				</FooterLink>
			))}
		</FooterColumn>
	);
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<div>
			<h3 className="text-[10px] tracking-[0.3em] uppercase text-foreground font-medium">{title}</h3>
			<ul className="mt-6 space-y-3.5">{children}</ul>
		</div>
	);
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
	return (
		<li>
			<Link href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
				{children}
			</Link>
		</li>
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
		<footer className="bg-background border-t border-border">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
				{/* Large editorial wordmark */}
				<div className="py-16 sm:py-20 border-b border-border">
					<p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground text-center">
						An archive of considered apparel
					</p>
					<div className="mt-6 font-display text-center text-[14vw] sm:text-[10vw] lg:text-[8vw] leading-[0.9] tracking-[0.05em] text-foreground select-none">
						YOUR NEXT STORE
					</div>
				</div>

				{/* Link columns */}
				<div className="py-14 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-10">
					<div className="col-span-2 lg:col-span-2 max-w-xs">
						<Link href="/" className="font-display text-base tracking-[0.3em] text-foreground">
							YOUR NEXT STORE
						</Link>
						<p className="mt-4 text-sm leading-relaxed text-muted-foreground">
							Considered apparel and accessories, sourced from independent ateliers and small-batch makers.
						</p>
						<div className="mt-6 flex items-center gap-4 text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
							<span>EN / USD</span>
							<span aria-hidden>·</span>
							<span>Ship Worldwide</span>
						</div>
					</div>

					<FooterCollections />

					<FooterColumn title="Support">
						<FooterLink href="/about">About Us</FooterLink>
						<FooterLink href="/faq">FAQ</FooterLink>
						<FooterLink href="/faq#shipping">Shipping</FooterLink>
						<FooterLink href="/faq#returns">Returns</FooterLink>
						<FooterLink href="/faq#care">Garment Care</FooterLink>
						<FooterContactLink />
						<FooterBlogLink />
					</FooterColumn>

					<FooterLegalPages />
				</div>

				{/* Bottom bar */}
				<div className="py-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
						© {year} Your Next Store — All rights reserved
					</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
