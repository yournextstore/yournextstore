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
				className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
				className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
			<h3 className="text-[11px] uppercase tracking-[0.28em] text-cream/55 mb-5">Shop</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="font-serif text-base text-cream/80 hover:text-cream transition-colors"
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
			<h3 className="text-[11px] uppercase tracking-[0.28em] text-cream/55 mb-5">Legal</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="font-serif text-base text-cream/80 hover:text-cream transition-colors"
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
		<footer className="bg-aura-espresso text-cream">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
					{/* Brand */}
					<div className="max-w-sm">
						<YnsLink prefetch={"eager"} href="/" className="block">
							<span className="font-serif italic text-2xl">Your</span>{" "}
							<span className="font-serif tracking-[0.18em] uppercase">Next Store</span>
						</YnsLink>
						<p className="mt-5 text-sm text-cream/65 leading-relaxed">
							Slow-made objects for unhurried homes. Stone, clay and linen — shaped by hand in our Puglian
							atelier.
						</p>
						<div className="mt-7 flex items-center gap-3">
							{["Instagram", "Pinterest", "Journal"].map((label) => (
								<YnsLink
									key={label}
									href="#"
									className="text-[10px] uppercase tracking-[0.22em] text-cream/65 border border-cream/15 rounded-full px-3 py-1.5 hover:border-cream/40 hover:text-cream transition-colors"
								>
									{label}
								</YnsLink>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-[11px] uppercase tracking-[0.28em] text-cream/55 mb-5">Atelier</h3>
						<ul className="space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="font-serif text-base text-cream/80 hover:text-cream transition-colors"
								>
									Journal
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="font-serif text-base text-cream/80 hover:text-cream transition-colors"
								>
									Care & repair
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="font-serif text-base text-cream/80 hover:text-cream transition-colors"
								>
									Contact
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="py-6 border-t border-cream/12 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-[11px] uppercase tracking-[0.22em] text-cream/45">
					<p>&copy; {new Date().getFullYear()} Your Next Store · Made in Puglia</p>
					<p className="font-serif italic normal-case tracking-normal text-cream/55 text-sm">
						&ldquo;Slowness is a kindness.&rdquo;
					</p>
				</div>
			</div>
		</footer>
	);
}
