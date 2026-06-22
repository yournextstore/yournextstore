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
			<Link href="/blog" className="hover:text-foreground transition-colors">
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
			<Link href="/contact" className="hover:text-foreground transition-colors">
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
			<h3 className="text-[11px] tracking-[0.22em] uppercase text-foreground">Catalogue</h3>
			<ul className="mt-5 space-y-2.5">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="font-serif text-lg italic text-muted-foreground hover:text-clay transition-colors"
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
			<h3 className="text-[11px] tracking-[0.22em] uppercase text-foreground">Fine print</h3>
			<ul className="mt-5 space-y-2.5">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-[14px] text-muted-foreground hover:text-foreground transition-colors"
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
		<footer className="border-t border-border/60 bg-background">
			<div className="mx-auto max-w-[1600px] px-6 lg:px-12">
				<div className="grid grid-cols-12 gap-6 lg:gap-10 py-20">
					{/* Brand block */}
					<div className="col-span-12 lg:col-span-5">
						<Link
							href="/"
							className="block font-serif text-5xl lg:text-6xl tracking-[-0.03em] text-foreground"
						>
							Your <span className="italic text-clay">Next</span> Store
							<span className="text-clay">.</span>
						</Link>
						<p className="mt-6 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
							Quiet objects for considered rooms — commissioned from independent makers and finished in small
							batches. Made to outlast a trend.
						</p>
						<div className="mt-8 flex items-center gap-4 text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
							<a
								href="https://instagram.com"
								className="hover:text-foreground transition-colors"
								target="_blank"
								rel="noreferrer"
							>
								Instagram
							</a>
							<span aria-hidden="true">·</span>
							<a
								href="https://pinterest.com"
								className="hover:text-foreground transition-colors"
								target="_blank"
								rel="noreferrer"
							>
								Pinterest
							</a>
							<span aria-hidden="true">·</span>
							<a
								href="https://journal.yournextstore"
								className="hover:text-foreground transition-colors"
								target="_blank"
								rel="noreferrer"
							>
								Journal
							</a>
						</div>
					</div>

					<div className="col-span-6 md:col-span-4 lg:col-span-2 lg:col-start-7">
						<FooterCollections />
					</div>

					<div className="col-span-6 md:col-span-4 lg:col-span-2">
						<h3 className="text-[11px] tracking-[0.22em] uppercase text-foreground">Atelier</h3>
						<ul className="mt-5 space-y-2.5 text-[14px] text-muted-foreground">
							<li>
								<Link href="/faq" className="hover:text-foreground transition-colors">
									Frequent questions
								</Link>
							</li>
							<li>
								<Link href="/about" className="hover:text-foreground transition-colors">
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link href="/products" className="hover:text-foreground transition-colors">
									Customise an order
								</Link>
							</li>
							<li>
								<a href="mailto:hello@yournextstore.com" className="hover:text-foreground transition-colors">
									Trade enquiries
								</a>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<div className="col-span-12 md:col-span-4 lg:col-span-2">
						<FooterLegalPages />
					</div>
				</div>

				<div className="flex flex-col gap-3 border-t border-border/60 py-6 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
						© {year} Your Next Store — Est. 1956
					</p>
					<p className="font-serif text-sm italic text-muted-foreground">
						Designed in daylight. Shipped in linen.
					</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
