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
			<Link href="/blog" className="text-sm text-foreground/78 transition-colors hover:text-foreground">
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
			<Link href="/contact" className="text-sm text-foreground/78 transition-colors hover:text-foreground">
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
			<h3 className="mb-5 text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">Collections</h3>
			<ul className="space-y-2.5">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-foreground/78 transition-colors hover:text-foreground"
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
			<h3 className="mb-5 text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">Information</h3>
			<ul className="space-y-2.5">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-foreground/78 transition-colors hover:text-foreground"
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
		<footer className="border-t border-border/80 bg-[var(--surface-soft)]">
			<div className="section-shell grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,0.75fr))]">
				<div className="max-w-sm space-y-6">
					<Link href="/" className="font-editorial text-3xl tracking-[-0.04em]">
						Vela
					</Link>
					<p className="text-sm leading-7 text-muted-foreground">
						Furniture, lighting, and objects selected for rooms that feel warm, quiet, and lived in.
					</p>
					<div className="flex flex-wrap gap-x-6 gap-y-2 text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">
						<Link href="/products" className="transition-colors hover:text-foreground">
							Shop the edit
						</Link>
						<Link href="/search" className="transition-colors hover:text-foreground">
							Search
						</Link>
						<Link href="/faq" className="transition-colors hover:text-foreground">
							Client services
						</Link>
					</div>
				</div>

				<div>
					<FooterCollections />
				</div>
				<div>
					<h3 className="mb-5 text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">
						Client Services
					</h3>
					<ul className="space-y-2.5">
						{[
							{ label: "Search the catalog", href: "/search" },
							{ label: "Frequently asked questions", href: "/faq" },
							{ label: "All products", href: "/products" },
						].map((link) => (
							<li key={link.label}>
								<Link
									href={link.href}
									className="text-sm text-foreground/78 transition-colors hover:text-foreground"
								>
									{link.label}
								</Link>
							</li>
						))}
						<li>
							<Link
								href="/about"
								className="text-sm text-foreground/78 transition-colors hover:text-foreground"
							>
								About Us
							</Link>
						</li>
						<FooterContactLink />
						<FooterBlogLink />
					</ul>
				</div>
				<FooterLegalPages />
			</div>

			<div className="page-shell flex flex-col items-start justify-between gap-3 border-t border-border/80 py-5 text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground sm:flex-row sm:items-center">
				<p>&copy; {year} Vela. All rights reserved.</p>
				<PaymentMethods />
				<a
					href="#newsletter"
					className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
				>
					Join the list
					<ArrowUp className="h-3.5 w-3.5 rotate-45" />
				</a>
			</div>
		</footer>
	);
}
