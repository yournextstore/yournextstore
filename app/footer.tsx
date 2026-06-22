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
				className="text-sm text-muted-foreground hover:text-ember transition-colors"
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
				className="text-sm text-muted-foreground hover:text-ember transition-colors"
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
			<h3 className="text-[11px] uppercase tracking-[0.22em] font-medium text-bone/90">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-muted-foreground hover:text-ember transition-colors"
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
			<h3 className="text-[11px] uppercase tracking-[0.22em] font-medium text-bone/90">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-muted-foreground hover:text-ember transition-colors"
						>
							{page.label}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

const SOCIAL_LINKS = [
	{ label: "Instagram", href: "#" },
	{ label: "TikTok", href: "#" },
	{ label: "YouTube", href: "#" },
];

export function Footer() {
	return (
		<footer className="relative border-t border-border bg-black">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 grid grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
					{/* Brand */}
					<div className="col-span-2 lg:col-span-4 max-w-xs">
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-display text-3xl italic font-extrabold tracking-tight text-bone"
						>
							yns<span className="text-ember">.</span>
						</YnsLink>
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
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-muted-foreground hover:text-ember transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-muted-foreground hover:text-ember transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-muted-foreground hover:text-ember transition-colors"
								>
									Returns
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-muted-foreground hover:text-ember transition-colors"
								>
									Shipping
								</YnsLink>
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
				<div className="py-7 border-t border-border flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
					<p className="text-xs text-muted-foreground">
						© {new Date().getFullYear()} Your Next Store. Built quietly.
					</p>
					<p className="text-xs text-muted-foreground">Designed in Brooklyn · Made on Earth</p>
				</div>
			</div>
		</footer>
	);
}
