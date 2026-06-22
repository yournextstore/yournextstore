import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { WipMonogram } from "@/components/wip-monogram";
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
			<Link href="/blog" className="text-sm text-background/70 transition-colors hover:text-background">
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
			<Link href="/contact" className="text-sm text-background/70 transition-colors hover:text-background">
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
			<h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-zap">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-background/70 transition-colors hover:text-background"
						>
							{collection.name}
						</Link>
					</li>
				))}
				<li>
					<Link
						href="/products"
						className="text-sm text-background/70 transition-colors hover:text-background"
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
			<h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-zap">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-background/70 transition-colors hover:text-background"
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
		<footer className="relative overflow-hidden bg-foreground text-background">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 opacity-20"
				style={{
					backgroundImage: "radial-gradient(circle, #f1f23b 1px, transparent 1.2px)",
					backgroundSize: "26px 26px",
					maskImage: "linear-gradient(180deg, black 0%, transparent 60%)",
					WebkitMaskImage: "linear-gradient(180deg, black 0%, transparent 60%)",
				}}
			/>
			<div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
				{/* Top giant wordmark */}
				<div className="border-b border-background/15 py-10 sm:py-14">
					<p className="font-display text-[18vw] uppercase leading-none tracking-tight text-background sm:text-[14vw] lg:text-[10rem]">
						Your Next Store.
					</p>
				</div>

				<div className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
					<div className="lg:col-span-2">
						<Link href="/" aria-label="Your Next Store" className="inline-flex">
							<WipMonogram className="h-9 w-auto text-zap" />
						</Link>
						<p className="mt-5 max-w-sm text-sm leading-relaxed text-background/65">
							Natural caffeine energy pouches engineered for clean focus. Crafted in small batches. Built for
							the long days.
						</p>
						<p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-background/40">
							hello@yournextstore.com
						</p>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-zap">Support</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<Link
									href="/about"
									className="text-sm text-background/70 transition-colors hover:text-background"
								>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link
									href="/faq"
									className="text-sm text-background/70 transition-colors hover:text-background"
								>
									FAQ
								</Link>
							</li>
							<li>
								<Link
									href="/faq"
									className="text-sm text-background/70 transition-colors hover:text-background"
								>
									The Science
								</Link>
							</li>
							<li>
								<Link
									href="/faq"
									className="text-sm text-background/70 transition-colors hover:text-background"
								>
									Responsible Caffeine
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="flex flex-col items-start justify-between gap-3 border-t border-background/15 py-6 sm:flex-row sm:items-center">
					<p className="text-xs font-semibold uppercase tracking-[0.22em] text-background/50">
						&copy; {year} Your Next Store. All rights reserved.
					</p>
					<div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
						<p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-background/40">
							Consume responsibly · Not for under 18
						</p>
						{/* Light chip: the payment marks are drawn for a light background. */}
						<div className="rounded-md bg-background px-2 py-1.5">
							<PaymentMethods />
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
