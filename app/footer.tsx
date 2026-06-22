import { ArrowUp } from "lucide-react";
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
			<h3 className="text-xs font-medium uppercase tracking-[0.15em] text-foreground mb-5">Collections</h3>
			<ul className="space-y-2.5">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
			<h3 className="text-xs font-medium uppercase tracking-[0.15em] text-foreground mb-5">Information</h3>
			<ul className="space-y-2.5">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
		<footer className="border-t border-border bg-background">
			{/* Back to top */}
			<div className="flex justify-center -mt-5">
				<a
					href="#top"
					className="bg-background border border-border px-4 py-2 text-xs font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
				>
					Top
					<ArrowUp className="h-3 w-3" />
				</a>
			</div>

			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
					{/* Collections */}
					<FooterCollections />

					{/* Navigate */}
					<div>
						<h3 className="text-xs font-medium uppercase tracking-[0.15em] text-foreground mb-5">Navigate</h3>
						<ul className="space-y-2.5">
							{[
								{ label: "Search", href: "/search" },
								{ label: "Our Story", href: "/products" },
							].map((link) => (
								<li key={link.label}>
									<Link
										href={link.href}
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										{link.label}
									</Link>
								</li>
							))}
							<li>
								<Link
									href="/about"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<FooterBlogLink />
						</ul>
					</div>

					{/* Legal / Information */}
					<FooterLegalPages />

					{/* Follow */}
					<div>
						<h3 className="text-xs font-medium uppercase tracking-[0.15em] text-foreground mb-5">
							Follow us
						</h3>
						<div className="flex gap-4">
							{["Instagram", "Pinterest", "TikTok"].map((social) => (
								<span
									key={social}
									className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
								>
									{social}
								</span>
							))}
						</div>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-border flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-xs text-muted-foreground">&copy; {year} Your Next Store. All rights reserved.</p>
					<div className="flex flex-wrap items-center gap-4">
						<Link href="/" className="text-lg tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
							FORMA
						</Link>
						<PaymentMethods />
					</div>
				</div>
			</div>
		</footer>
	);
}
