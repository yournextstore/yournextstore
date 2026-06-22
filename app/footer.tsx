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
			<Link href="/blog" className="text-sm text-bone/80 hover:text-brick transition-colors">
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
			<Link href="/contact" className="text-sm text-bone/80 hover:text-brick transition-colors">
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
			<h3 className="text-[10px] tracking-[0.3em] uppercase text-bone/55 font-semibold">Shop</h3>
			<ul className="mt-4 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-bone/80 hover:text-brick transition-colors"
						>
							{collection.name}
						</Link>
					</li>
				))}
				<li>
					<Link href="/products" className="text-sm text-bone/80 hover:text-brick transition-colors">
						All products
					</Link>
				</li>
				<li>
					<Link href="#bundles" className="text-sm text-bone/80 hover:text-brick transition-colors">
						Bundles
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
			<h3 className="text-[10px] tracking-[0.3em] uppercase text-bone/55 font-semibold">Legal</h3>
			<ul className="mt-4 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-bone/80 hover:text-brick transition-colors"
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

const SOCIAL = [
	{ name: "Instagram", href: "https://instagram.com" },
	{ name: "Tiktok", href: "https://tiktok.com" },
	{ name: "Are.na", href: "https://are.na" },
	{ name: "Spotify", href: "https://spotify.com" },
];

export async function Footer() {
	const year = await getCopyrightYear();

	return (
		<footer className="relative bg-ink text-bone overflow-hidden">
			<div className="absolute inset-0 bg-grain opacity-15 pointer-events-none" />

			<div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-10 sm:gap-8">
					<div className="col-span-2 lg:col-span-2 sm:max-w-sm">
						<Link href="/" className="font-display-wide text-xl tracking-[0.18em] text-bone">
							YOUR NEXT STORE
						</Link>
						<p className="mt-5 text-sm text-bone/65 leading-relaxed">
							Built for the urban everyday. A small, opinionated catalog of essentials for people who actually
							use their stuff.
						</p>
						<div className="mt-7 flex items-center gap-1.5 text-[11px] tracking-[0.3em] uppercase">
							<span className="px-2.5 py-1 border border-bone/25 text-bone/80">🇺🇸 USD</span>
							<span className="px-2.5 py-1 border border-bone/25 text-bone/80">EN</span>
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-[10px] tracking-[0.3em] uppercase text-bone/55 font-semibold">Support</h3>
						<ul className="mt-4 space-y-3">
							<li>
								<Link href="/about" className="text-sm text-bone/80 hover:text-brick transition-colors">
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link href="/faq" className="text-sm text-bone/80 hover:text-brick transition-colors">
									FAQ
								</Link>
							</li>
							<li>
								<Link href="#about" className="text-sm text-bone/80 hover:text-brick transition-colors">
									Our Story
								</Link>
							</li>
							<li>
								<Link href="#club" className="text-sm text-bone/80 hover:text-brick transition-colors">
									The Club
								</Link>
							</li>
							<li>
								<a
									href="mailto:hello@yournextstore.com"
									className="text-sm text-bone/80 hover:text-brick transition-colors"
								>
									Contact
								</a>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="relative -mx-4 sm:-mx-6 lg:-mx-8 select-none">
					<div className="text-stroke-bone font-display-wide leading-none text-center text-[clamp(4rem,18vw,18rem)] tracking-[0.04em] uppercase opacity-25">
						Your Next Store
					</div>
				</div>

				<div className="py-7 border-t border-bone/15 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-xs text-bone/55">&copy; {year} Your Next Store. Built in Brooklyn, NY.</p>
					<PaymentMethods />
					<div className="flex items-center gap-5">
						{SOCIAL.map((s) => (
							<a
								key={s.name}
								href={s.href}
								className="text-[11px] tracking-[0.3em] uppercase text-bone/65 hover:text-brick transition-colors"
							>
								{s.name}
							</a>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}
