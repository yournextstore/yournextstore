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
			<Link
				href="/blog"
				className="text-[var(--tizz-cream)]/80 hover:text-[var(--tizz-yellow)] transition-colors"
			>
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
			<Link
				href="/contact"
				className="text-[var(--tizz-cream)]/80 hover:text-[var(--tizz-yellow)] transition-colors"
			>
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
			<h3 className="tizz-overline text-[var(--tizz-yellow)] text-xs mb-5">Collections</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-[var(--tizz-cream)]/80 hover:text-[var(--tizz-yellow)] transition-colors"
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
			<h3 className="tizz-overline text-[var(--tizz-yellow)] text-xs mb-5">Legal</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-[var(--tizz-cream)]/80 hover:text-[var(--tizz-yellow)] transition-colors"
						>
							{page.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

const SOCIALS = [
	{ label: "Instagram", href: "#", icon: "IG" },
	{ label: "TikTok", href: "#", icon: "TT" },
	{ label: "X", href: "#", icon: "X" },
	{ label: "YouTube", href: "#", icon: "YT" },
];

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
		<footer className="relative bg-[var(--tizz-deep)] text-[var(--tizz-cream)] overflow-hidden">
			<div className="absolute inset-0 tizz-noise opacity-60" />
			<div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-12">
					<div className="col-span-2">
						<Link href="/" className="block">
							<span className="tizz-display text-[var(--tizz-orange)] text-7xl sm:text-8xl lg:text-9xl leading-none block">
								YNS
							</span>
							<span className="tizz-display text-[var(--tizz-yellow)] text-3xl sm:text-4xl lg:text-5xl leading-none block">
								Your Next Store
							</span>
						</Link>
						<p className="mt-6 max-w-sm text-[var(--tizz-cream)]/70 leading-relaxed">
							Loud-flavor soda, bottled in Brooklyn. Less sugar. More fizz. Direct from the can vault to your
							fridge.
						</p>
						<div className="mt-6 flex gap-2">
							{SOCIALS.map((s) => (
								<a
									key={s.label}
									href={s.href}
									aria-label={s.label}
									className="inline-flex items-center justify-center w-11 h-11 rounded-full border-2 border-[var(--tizz-cream)]/30 text-[var(--tizz-cream)] tizz-overline text-[10px] hover:bg-[var(--tizz-yellow)] hover:text-[var(--tizz-deep)] hover:border-[var(--tizz-yellow)] transition-colors"
								>
									{s.icon}
								</a>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="tizz-overline text-[var(--tizz-yellow)] text-xs mb-5">Help</h3>
						<ul className="space-y-3">
							<li>
								<Link
									href="/about"
									className="text-[var(--tizz-cream)]/80 hover:text-[var(--tizz-yellow)] transition-colors"
								>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link
									href="/faq"
									className="text-[var(--tizz-cream)]/80 hover:text-[var(--tizz-yellow)] transition-colors"
								>
									FAQ
								</Link>
							</li>
							<li>
								<Link
									href="/products"
									className="text-[var(--tizz-cream)]/80 hover:text-[var(--tizz-yellow)] transition-colors"
								>
									Shop all
								</Link>
							</li>
							<li>
								<Link
									href="/search"
									className="text-[var(--tizz-cream)]/80 hover:text-[var(--tizz-yellow)] transition-colors"
								>
									Search
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				{/* Giant wordmark */}
				<div className="relative -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden border-t-2 border-[var(--tizz-cream)]/10">
					<div className="py-6 flex items-center justify-center">
						<span className="tizz-display text-[var(--tizz-orange)] text-[20vw] sm:text-[18vw] leading-[0.85] select-none">
							YOUR NEXT STORE
						</span>
					</div>
				</div>

				<div className="py-6 border-t border-[var(--tizz-cream)]/10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<p className="tizz-overline text-[10px] text-[var(--tizz-cream)]/50">
						&copy; {year} Your Next Store · All rights reserved
					</p>
					<PaymentMethods className="rounded-full bg-[var(--tizz-cream)] px-3 py-1.5" />
					<p className="tizz-overline text-[10px] text-[var(--tizz-cream)]/50">
						Drink responsibly · Recycle the can
					</p>
				</div>
			</div>
		</footer>
	);
}
