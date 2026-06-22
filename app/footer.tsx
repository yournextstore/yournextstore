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
			<Link href="/blog" className="text-sm text-background/75 hover:text-background transition-colors">
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
			<Link href="/contact" className="text-sm text-background/75 hover:text-background transition-colors">
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
			<h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/60">Collections</h3>
			<ul className="mt-4 space-y-2.5">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-foreground/75 hover:text-foreground transition-colors"
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
			<h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/60">Legal</h3>
			<ul className="mt-4 space-y-2.5">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-foreground/75 hover:text-foreground transition-colors"
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

const SOCIAL_ICONS = [
	{
		name: "Instagram",
		path: "M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.9.3 2.3.4.6.2 1 .5 1.5.9.5.5.8 1 .9 1.5.2.4.4 1.1.4 2.3.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.3 1.9-.4 2.3-.2.6-.5 1-.9 1.5-.5.5-1 .8-1.5.9-.4.2-1.1.4-2.3.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.9-.3-2.3-.4a3.9 3.9 0 0 1-1.5-.9 3.9 3.9 0 0 1-.9-1.5c-.2-.4-.4-1.1-.4-2.3C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.3-1.9.4-2.3.2-.6.5-1 .9-1.5.5-.5 1-.8 1.5-.9.4-.2 1.1-.4 2.3-.4C8.4 2.2 8.8 2.2 12 2.2zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2A3.2 3.2 0 1 1 12 8.8a3.2 3.2 0 0 1 0 6.4zM17.6 5.4a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z",
	},
	{
		name: "Twitter",
		path: "M22 5.8c-.7.3-1.5.5-2.4.6.9-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1A4.2 4.2 0 0 0 12 9.1c0 .3 0 .6.1.9A11.7 11.7 0 0 1 3.4 5a4 4 0 0 0 1.3 5.5 4.1 4.1 0 0 1-1.9-.5v.1c0 2 1.4 3.6 3.3 4a4.2 4.2 0 0 1-1.9.1 4.2 4.2 0 0 0 3.9 2.9A8.3 8.3 0 0 1 2 18.8a11.6 11.6 0 0 0 6.3 1.8c7.5 0 11.6-6.2 11.6-11.6v-.5A8.4 8.4 0 0 0 22 5.8z",
	},
	{
		name: "TikTok",
		path: "M19.6 6.3a4.7 4.7 0 0 1-3.2-1.2A4.7 4.7 0 0 1 15.1 2H12v13.2a2.7 2.7 0 1 1-1.9-2.6v-3.3a6 6 0 1 0 5 5.9V8.5a8 8 0 0 0 4.6 1.5V6.3z",
	},
];

export async function Footer() {
	const year = await getCopyrightYear();

	return (
		<footer className="relative overflow-hidden bg-foreground text-background">
			<div
				aria-hidden="true"
				className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_8%_8%,oklch(0.55_0.22_295/0.6),transparent_40%),radial-gradient(circle_at_92%_92%,oklch(0.85_0.13_88/0.35),transparent_45%)]"
			/>
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-8 sm:gap-12">
					<div className="col-span-2 lg:col-span-2 max-w-xs">
						<Link href="/" className="font-serif text-2xl tracking-tight text-background">
							Your Next Store
						</Link>
						<p className="mt-4 text-sm text-background/70 leading-relaxed">
							Built for indie creators. Sell digital goods, drops, and originals — keep 100% of your
							royalties.
						</p>
						<div className="mt-6 flex items-center gap-2">
							{/* Placeholder icons: no profile URLs yet, so they are not links. */}
							{SOCIAL_ICONS.map((icon) => (
								<span
									key={icon.name}
									className="grid place-items-center h-9 w-9 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
								>
									<span className="sr-only">{icon.name}</span>
									<svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
										<title>{icon.name}</title>
										<path d={icon.path} />
									</svg>
								</span>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-xs font-semibold uppercase tracking-wider text-background/60">Support</h3>
						<ul className="mt-4 space-y-2.5">
							<li>
								<Link
									href="/about"
									className="text-sm text-background/75 hover:text-background transition-colors"
								>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link
									href="/faq"
									className="text-sm text-background/75 hover:text-background transition-colors"
								>
									FAQ
								</Link>
							</li>
							<FooterBlogLink />
							<li>
								<Link
									href="/products"
									className="text-sm text-background/75 hover:text-background transition-colors"
								>
									Shop all
								</Link>
							</li>
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="py-6 border-t border-background/15 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-xs text-background/60">
						&copy; {year} Your Next Store. Craft joy, magnify thrill.
					</p>
					<p className="text-xs text-background/60">Made with care for creators worldwide.</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
