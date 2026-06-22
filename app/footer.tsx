import { Leaf, Mail, Sparkles } from "lucide-react";
import { cacheLife } from "next/cache";
import { YnsLink } from "@/components/yns-link";
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
			<YnsLink
				prefetch={"eager"}
				href="/blog"
				className="text-sm text-cream/65 hover:text-cream transition-colors"
			>
				Blog
			</YnsLink>
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
			<YnsLink
				prefetch={"eager"}
				href="/contact"
				className="text-sm text-cream/65 hover:text-cream transition-colors"
			>
				Contact Us
			</YnsLink>
		</li>
	);
}

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="font-serif text-base text-cream">Shop</h3>
			<ul className="mt-4 space-y-2.5">
				<li>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="text-sm text-cream/65 hover:text-cream transition-colors"
					>
						All products
					</YnsLink>
				</li>
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-cream/65 hover:text-cream transition-colors"
						>
							{collection.name}
						</YnsLink>
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
			<h3 className="font-serif text-base text-cream">Legal</h3>
			<ul className="mt-4 space-y-2.5">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-cream/65 hover:text-cream transition-colors"
						>
							{page.label}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

export function Footer() {
	return (
		<footer className="bg-cocoa text-cream">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-12 gap-10 lg:gap-12 py-16 sm:py-20">
					<div className="col-span-2 sm:col-span-3 lg:col-span-5">
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-serif text-3xl text-cream inline-flex items-baseline gap-1"
						>
							Your Next Store
							<sup className="text-[0.5em] text-peach -translate-y-1 align-super">®</sup>
						</YnsLink>
						<p className="mt-4 text-sm text-cream/70 leading-relaxed max-w-sm">
							A modern apothecary of botanical essentials — quietly considered, slow-made, and gently scented
							with the season.
						</p>
						<div className="mt-7 flex flex-wrap gap-3 text-xs">
							<span className="inline-flex items-center gap-1.5 rounded-full bg-cream/10 px-3 py-1.5 text-cream/80 ring-1 ring-cream/10">
								<Leaf className="h-3 w-3 text-sage" /> Botanical
							</span>
							<span className="inline-flex items-center gap-1.5 rounded-full bg-cream/10 px-3 py-1.5 text-cream/80 ring-1 ring-cream/10">
								<Sparkles className="h-3 w-3 text-peach" /> Small-batch
							</span>
							<span className="inline-flex items-center gap-1.5 rounded-full bg-cream/10 px-3 py-1.5 text-cream/80 ring-1 ring-cream/10">
								Plastic-free
							</span>
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="font-serif text-base text-cream">Support</h3>
						<ul className="mt-4 space-y-2.5">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-cream/65 hover:text-cream transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-cream/65 hover:text-cream transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<FooterBlogLink />
							<li>
								<a
									href="mailto:hello@yournextstore.com"
									className="text-sm text-cream/65 hover:text-cream transition-colors"
								>
									Contact
								</a>
							</li>
							<li>
								<YnsLink
									href="/products"
									className="text-sm text-cream/65 hover:text-cream transition-colors"
								>
									Shipping
								</YnsLink>
							</li>
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="py-6 border-t border-cream/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
					<p className="text-xs text-cream/55 tracking-wide">
						&copy; {new Date().getFullYear()} Your Next Store. Steeped slowly in good intention.
					</p>
					<div className="flex items-center gap-4 text-cream/55">
						<a
							href="mailto:hello@yournextstore.com"
							aria-label="Email"
							className="hover:text-cream transition-colors"
						>
							<span className="sr-only">Email</span>
							<Mail className="h-4 w-4" />
						</a>
						<a
							href="https://instagram.com"
							aria-label="Instagram"
							className="hover:text-cream transition-colors"
						>
							<span className="sr-only">Instagram</span>
							<svg
								className="h-4 w-4"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<rect x="3" y="3" width="18" height="18" rx="5" />
								<circle cx="12" cy="12" r="4" />
								<circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
							</svg>
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
