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
			<Link href="/blog" className="text-sm text-cream/65 hover:text-terracotta transition-colors">
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
			<Link href="/contact" className="text-sm text-cream/65 hover:text-terracotta transition-colors">
				Contact Us
			</Link>
		</li>
	);
}

function InstagramIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.5}
			className={className}
			aria-hidden="true"
		>
			<rect x="3" y="3" width="18" height="18" rx="5" />
			<circle cx="12" cy="12" r="4" />
			<circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
		</svg>
	);
}

function TiktokIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.5}
			className={className}
			aria-hidden="true"
		>
			<path d="M16 4v9a4 4 0 1 1-4-4" strokeLinecap="round" />
			<path d="M16 4c.5 2 2 4 4 4" strokeLinecap="round" />
		</svg>
	);
}

function PinterestIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.5}
			className={className}
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="9" />
			<path
				d="M11 8c2-1 5 0 5 3s-2 4-4 4c-1 0-2-1-2-2l1-5-2 7"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
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
		<FooterColumn title="Shop">
			{collections.data.map((collection) => (
				<FooterLink key={collection.id} href={`/collection/${collection.slug}`}>
					{collection.name}
				</FooterLink>
			))}
			<FooterLink href="/products">All Products</FooterLink>
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
				<FooterLink href="/legal/privacy">Privacy</FooterLink>
				<FooterLink href="/legal/terms">Terms of Service</FooterLink>
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
		<footer className="walnut-bg text-cream">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10 sm:gap-12">
					{/* Brand */}
					<div className="col-span-2 lg:col-span-2 lg:pr-12">
						<Link href="/" className="font-serif text-2xl tracking-[0.18em] uppercase text-cream">
							Your Next Store
						</Link>
						<p className="mt-5 text-sm text-cream/60 leading-relaxed max-w-xs">
							Silk hair accessories and sleep care, crafted slowly and shipped with care from our atelier.
						</p>
						<div className="mt-7 flex items-center gap-4">
							<SocialLink href="#" label="Instagram">
								<InstagramIcon className="w-4 h-4" />
							</SocialLink>
							<SocialLink href="#" label="TikTok">
								<TiktokIcon className="w-4 h-4" />
							</SocialLink>
							<SocialLink href="#" label="Pinterest">
								<PinterestIcon className="w-4 h-4" />
							</SocialLink>
						</div>
					</div>

					<FooterCollections />

					<FooterColumn title="Support">
						<FooterLink href="/about">About Us</FooterLink>
						<FooterContactLink />
						<FooterLink href="/faq">FAQ</FooterLink>
						<FooterLink href="#">Shipping</FooterLink>
						<FooterLink href="#">Returns</FooterLink>
						<FooterLink href="#">Contact</FooterLink>
						<FooterBlogLink />
					</FooterColumn>

					<FooterLegalPages />
				</div>

				<div className="py-6 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-xs tracking-wider text-cream/50">
						&copy; {year} Your Next Store. All rights reserved.
					</p>
					{/* Official marks sit on a cream chip so they keep their colours on the walnut footer. */}
					<div className="rounded-sm bg-cream px-3 py-2">
						<PaymentMethods className="justify-center" />
					</div>
				</div>
			</div>
		</footer>
	);
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<div>
			<h3 className="text-[11px] tracking-[0.3em] uppercase text-cream font-medium">{title}</h3>
			<ul className="mt-5 space-y-3">{children}</ul>
		</div>
	);
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
	return (
		<li>
			<Link href={href} className="text-sm text-cream/65 hover:text-terracotta transition-colors">
				{children}
			</Link>
		</li>
	);
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
	return (
		<a
			href={href}
			aria-label={label}
			className="w-9 h-9 rounded-full border border-cream/20 flex items-center justify-center text-cream/70 hover:text-terracotta hover:border-terracotta transition-colors"
		>
			{children}
		</a>
	);
}
