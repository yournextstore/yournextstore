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
			<h3 className="text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-foreground/80 transition-colors hover:text-foreground"
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
			<h3 className="text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-foreground/80 transition-colors hover:text-foreground"
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
		<footer className="bg-background border-t border-border">
			<div className="max-w-7xl mx-auto px-5 sm:px-8">
				<div className="py-20 grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
					<div className="max-w-sm">
						<Link href="/" className="inline-flex items-baseline gap-[0.18rem]">
							<span className="font-display text-[1.3rem] font-medium tracking-tight text-foreground lowercase">
								your
							</span>
							<span className="text-moss font-display text-[1.3rem]" aria-hidden="true">
								+
							</span>
							<span className="font-display text-[1.3rem] font-medium tracking-tight text-foreground lowercase">
								next store
							</span>
						</Link>
						<p className="mt-5 text-sm leading-relaxed text-muted-foreground">
							A complete cellular energy system. Engineered for the long arc — mitochondrial support, NAD+
							metabolism, and the daily ritual that keeps it all moving.
						</p>
						<div className="mt-7 flex flex-wrap items-center gap-2">
							{["Third-party tested", "NSF certified", "Vegan"].map((tag) => (
								<span
									key={tag}
									className="inline-flex h-7 items-center rounded-full border border-border px-3 text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground"
								>
									{tag}
								</span>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">Care</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<Link
									href="/about"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link
									href="/faq"
									className="text-sm text-foreground/80 transition-colors hover:text-foreground"
								>
									FAQ
								</Link>
							</li>
							<li>
								<Link
									href="/products"
									className="text-sm text-foreground/80 transition-colors hover:text-foreground"
								>
									Subscribe &amp; save
								</Link>
							</li>
							<li>
								<Link
									href="/#about"
									className="text-sm text-foreground/80 transition-colors hover:text-foreground"
								>
									Practitioners
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="py-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<p className="text-[0.78rem] text-muted-foreground">&copy; {year} Your Next Store. Steady on.</p>
					<p className="text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
						These statements have not been evaluated by the FDA.
					</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
