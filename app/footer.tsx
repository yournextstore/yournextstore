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
				className="text-sm text-foreground/85 hover:text-foreground transition-colors"
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
				className="text-sm text-foreground/85 hover:text-foreground transition-colors"
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
			<h3 className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Collections</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-foreground/85 hover:text-foreground transition-colors"
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
			<h3 className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-foreground/85 hover:text-foreground transition-colors"
						>
							{page.label}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

function FooterMascot() {
	return (
		<svg
			width="28"
			height="32"
			viewBox="0 0 22 26"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			<title>YNS mark</title>
			<path d="M6 2 L6 8 M16 2 L16 8" stroke="#f4f2f8" strokeWidth="1.5" strokeLinecap="round" />
			<ellipse cx="11" cy="14" rx="8" ry="9" stroke="#f4f2f8" strokeWidth="1.5" fill="none" />
			<circle cx="8" cy="13" r="1.2" fill="#f4f2f8" />
			<circle cx="14" cy="13" r="1.2" fill="#f4f2f8" />
			<path d="M9 17 Q11 19 13 17" stroke="#f4f2f8" strokeWidth="1.3" strokeLinecap="round" fill="none" />
		</svg>
	);
}

export function Footer() {
	return (
		<footer className="relative bg-[#050817] border-t border-border">
			<div className="max-w-7xl mx-auto px-6 lg:px-12">
				<div className="py-20 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-10">
					{/* Brand */}
					<div className="col-span-2 sm:col-span-4 lg:col-span-2 max-w-sm">
						<YnsLink prefetch={"eager"} href="/" className="inline-flex items-center gap-3">
							<FooterMascot />
							<span className="font-serif text-2xl tracking-tight">Your Next Store</span>
						</YnsLink>
						<p className="mt-5 text-sm text-muted-foreground leading-relaxed font-light max-w-xs">
							Small, considered objects. Made for nightwalkers, slow readers, and patient pockets.
						</p>
						<div className="mt-8 flex items-center gap-3">
							{["Instagram", "Twitter", "Soundcloud"].map((platform) => (
								<a
									key={platform}
									href={`https://${platform.toLowerCase()}.com`}
									className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-[#4a76ff]/40 transition-colors"
									aria-label={platform}
								>
									<span className="text-[10px] uppercase tracking-wider">{platform[0]}</span>
								</a>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Support</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-foreground/85 hover:text-foreground transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-foreground/85 hover:text-foreground transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<FooterBlogLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-foreground/85 hover:text-foreground transition-colors"
								>
									Shop
								</YnsLink>
							</li>
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="py-7 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
					<p className="text-xs text-muted-foreground">
						&copy; {new Date().getFullYear()} Your Next Store. Made in the small hours.
					</p>
					<p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
						Edition 01 · Limited
					</p>
				</div>
			</div>
		</footer>
	);
}
