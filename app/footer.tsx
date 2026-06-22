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
			<Link href="/blog" className="text-sm text-muted-foreground hover:text-ember transition-colors">
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
			<Link href="/contact" className="text-sm text-muted-foreground hover:text-ember transition-colors">
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
			<h3 className="text-[11px] uppercase tracking-[0.22em] font-medium text-bone/90">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-muted-foreground hover:text-ember transition-colors"
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
			<h3 className="text-[11px] uppercase tracking-[0.22em] font-medium text-bone/90">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-muted-foreground hover:text-ember transition-colors"
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

const SOCIAL_LINKS = [
	{ label: "Instagram", href: "#" },
	{ label: "TikTok", href: "#" },
	{ label: "YouTube", href: "#" },
];

export async function Footer() {
	const year = await getCopyrightYear();

	return (
		<footer className="relative border-t border-border bg-black">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 grid grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
					{/* Brand */}
					<div className="col-span-2 lg:col-span-4 max-w-xs">
						<Link href="/" className="font-display text-3xl italic font-extrabold tracking-tight text-bone">
							yns<span className="text-ember">.</span>
						</Link>
						<p className="mt-5 text-sm text-muted-foreground leading-relaxed">
							A small object for a quieter life. Reclaim your evenings, one tap at a time.
						</p>
						<div className="mt-7 flex items-center gap-4">
							{SOCIAL_LINKS.map(({ label, href }) => (
								<a
									key={label}
									href={href}
									className="text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-ember transition-colors"
								>
									{label}
								</a>
							))}
						</div>
					</div>

					{/* Collections */}
					<div className="col-span-1 lg:col-span-2 lg:col-start-6">
						<FooterCollections />
					</div>

					{/* Support */}
					<div className="col-span-1 lg:col-span-2">
						<h3 className="text-[11px] uppercase tracking-[0.22em] font-medium text-bone/90">Support</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<Link
									href="/about"
									className="text-sm text-muted-foreground hover:text-ember transition-colors"
								>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link
									href="/faq"
									className="text-sm text-muted-foreground hover:text-ember transition-colors"
								>
									FAQ
								</Link>
							</li>
							<li>
								<Link
									href="/products"
									className="text-sm text-muted-foreground hover:text-ember transition-colors"
								>
									Returns
								</Link>
							</li>
							<li>
								<Link
									href="/products"
									className="text-sm text-muted-foreground hover:text-ember transition-colors"
								>
									Shipping
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					{/* Legal */}
					<div className="col-span-1 lg:col-span-2">
						<FooterLegalPages />
					</div>
				</div>

				{/* Bottom bar */}
				<div className="py-7 border-t border-border flex flex-col gap-3 items-start sm:flex-row sm:items-center justify-between">
					<p className="text-xs text-muted-foreground">© {year} Your Next Store. Built quietly.</p>
					<p className="text-xs text-muted-foreground">Designed in Brooklyn · Made on Earth</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
