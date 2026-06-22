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
			<Link href="/blog" className="text-sm text-white/85 hover:text-white transition-colors">
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
			<Link href="/contact" className="text-sm text-white/85 hover:text-white transition-colors">
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
			<h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Collections</h3>
			<ul className="mt-4 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-white/85 hover:text-white transition-colors"
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
			<h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Legal</h3>
			<ul className="mt-4 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-white/85 hover:text-white transition-colors"
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
		<footer className="bg-[color:var(--brick-ink)] text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
					{/* Brand */}
					<div className="max-w-sm">
						<Link
							href="/"
							className="inline-flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-white"
						>
							<span
								aria-hidden
								className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/70"
							>
								<span className="block h-2.5 w-2.5 rounded-[2px] border border-white/70" />
							</span>
							YOUR NEXT STORE
						</Link>
						<p className="mt-5 text-sm text-white/65 leading-relaxed">
							Intentional tech for a calmer life. Designed with care, built to last.
						</p>
						<div className="mt-6 flex items-center gap-2">
							<span className="inline-flex h-9 items-center rounded-full border border-white/15 px-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white/70">
								iOS
							</span>
							<span className="inline-flex h-9 items-center rounded-full border border-white/15 px-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white/70">
								Android
							</span>
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Support</h3>
						<ul className="mt-4 space-y-3">
							<li>
								<Link href="/about" className="text-sm text-white/85 hover:text-white transition-colors">
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link href="/faq" className="text-sm text-white/85 hover:text-white transition-colors">
									FAQ
								</Link>
							</li>
							<FooterBlogLink />
							<li>
								<Link href="#story" className="text-sm text-white/85 hover:text-white transition-colors">
									Our Story
								</Link>
							</li>
							<li>
								<Link href="/products" className="text-sm text-white/85 hover:text-white transition-colors">
									Shop
								</Link>
							</li>
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="py-6 border-t border-white/10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-xs text-white/55">&copy; {year} Your Next Store. All rights reserved.</p>
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
						<p className="text-xs text-white/55">Made for focused humans.</p>
						<PaymentMethods />
					</div>
				</div>
			</div>
		</footer>
	);
}
