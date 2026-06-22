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
				className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
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
				className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
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
			<h3 className="text-[11px] tracking-luxe uppercase text-[#8b6b4a] mb-5">Collections</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
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
			<h3 className="text-[11px] tracking-luxe uppercase text-[#8b6b4a] mb-5">Legal</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
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
		<footer className="bg-cream-grain border-t border-[#e8dcc8]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-20 grid grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16">
					{/* Brand */}
					<div className="col-span-2 max-w-sm">
						<Link href="/" className="font-serif text-2xl text-foreground">
							Your Next Store
						</Link>
						<p className="mt-5 text-sm text-muted-foreground leading-[1.85] font-light">
							Hand-poured fragrance and quiet rituals for the home. Made in small batches with single-origin
							oils, traceable wax, and the patience of an old craft.
						</p>
						<div className="mt-6 flex items-center gap-3 text-[10px] tracking-luxe uppercase text-muted-foreground">
							<span>Free shipping over $120</span>
							<span className="opacity-30">·</span>
							<span>30-day returns</span>
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-[11px] tracking-luxe uppercase text-[#8b6b4a] mb-5">Maison</h3>
						<ul className="space-y-3">
							<li>
								<Link
									href="/about"
									className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
								>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link
									href="/#story"
									className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
								>
									Our Story
								</Link>
							</li>
							<li>
								<Link
									href="/faq"
									className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
								>
									Journal
								</Link>
							</li>
							<li>
								<Link
									href="/faq"
									className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
								>
									Care Guide
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				{/* Bottom bar */}
				<div className="py-8 border-t border-[#e8dcc8] flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-[10px] tracking-luxe uppercase text-muted-foreground">
						&copy; {year} Your Next Store · Hand-poured in small batches
					</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
