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
			<Link href="/blog" className="font-serif text-base text-cream/80 hover:text-cream transition-colors">
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
			<Link href="/contact" className="font-serif text-base text-cream/80 hover:text-cream transition-colors">
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
			<h3 className="text-[11px] uppercase tracking-[0.28em] text-cream/55 mb-5">Shop</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="font-serif text-base text-cream/80 hover:text-cream transition-colors"
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
			<h3 className="text-[11px] uppercase tracking-[0.28em] text-cream/55 mb-5">Legal</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="font-serif text-base text-cream/80 hover:text-cream transition-colors"
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
		<footer className="bg-aura-espresso text-cream">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
					{/* Brand */}
					<div className="max-w-sm">
						<Link href="/" className="block">
							<span className="font-serif italic text-2xl">Your</span>{" "}
							<span className="font-serif tracking-[0.18em] uppercase">Next Store</span>
						</Link>
						<p className="mt-5 text-sm text-cream/65 leading-relaxed">
							Slow-made objects for unhurried homes. Stone, clay and linen — shaped by hand in our Puglian
							atelier.
						</p>
						<div className="mt-7 flex items-center gap-3">
							{["Instagram", "Pinterest", "Journal"].map((label) => (
								<Link
									key={label}
									href="#"
									className="text-[10px] uppercase tracking-[0.22em] text-cream/65 border border-cream/15 rounded-full px-3 py-1.5 hover:border-cream/40 hover:text-cream transition-colors"
								>
									{label}
								</Link>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-[11px] uppercase tracking-[0.28em] text-cream/55 mb-5">Atelier</h3>
						<ul className="space-y-3">
							<li>
								<Link
									href="/about"
									className="font-serif text-base text-cream/80 hover:text-cream transition-colors"
								>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link
									href="/faq"
									className="font-serif text-base text-cream/80 hover:text-cream transition-colors"
								>
									Journal
								</Link>
							</li>
							<li>
								<Link
									href="/faq"
									className="font-serif text-base text-cream/80 hover:text-cream transition-colors"
								>
									Care & repair
								</Link>
							</li>
							<li>
								<Link
									href="/faq"
									className="font-serif text-base text-cream/80 hover:text-cream transition-colors"
								>
									Contact
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-cream/12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-[11px] uppercase tracking-[0.22em] text-cream/45">
					<p>&copy; {year} Your Next Store · Made in Puglia</p>
					<p className="font-serif italic normal-case tracking-normal text-cream/55 text-sm">
						&ldquo;Slowness is a kindness.&rdquo;
					</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
