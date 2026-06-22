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
				className="text-[15px] text-foreground/80 hover:text-foreground transition-colors"
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
				className="text-[15px] text-foreground/80 hover:text-foreground transition-colors"
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
			<h3 className="yns-eyebrow text-foreground/60">Collections</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch="eager"
							href={`/collection/${collection.slug}`}
							className="text-[15px] text-foreground/80 hover:text-foreground transition-colors"
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
			<h3 className="yns-eyebrow text-foreground/60">Fine print</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch="eager"
							href={`/legal${page.href}`}
							className="text-[15px] text-foreground/80 hover:text-foreground transition-colors"
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
		<footer className="bg-[color:var(--yns-cream-deep)] text-foreground">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-16 sm:pt-24 pb-10">
				<div className="border-b border-foreground/15 pb-12 sm:pb-16">
					<h2 className="yns-wordmark text-[26vw] sm:text-[19vw] lg:text-[17vw] text-foreground select-none">
						YOUR NEXT
					</h2>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-10 sm:gap-12 py-12 sm:py-16">
					<div className="col-span-2 sm:col-span-4 lg:col-span-2 max-w-md">
						<p className="yns-eyebrow text-[color:var(--yns-terracotta)]">The workshop</p>
						<p className="mt-4 text-[15px] leading-relaxed text-foreground/80">
							Your Next Store is a small studio of woodworkers, painters and parents — making sculptural toys
							and design objects, one batch at a time.
						</p>
						<p className="mt-6 text-[13px] text-foreground/50">
							hello@yournextstore.com
							<br />
							Mon–Fri · 9 – 17 CET
						</p>
					</div>

					<div>
						<h3 className="yns-eyebrow text-foreground/60">Shop</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch="eager"
									href="/products"
									className="text-[15px] text-foreground/80 hover:text-foreground transition-colors"
								>
									All products
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch="eager"
									href="/#about"
									className="text-[15px] text-foreground/80 hover:text-foreground transition-colors"
								>
									Our story
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch="eager"
									href="/faq"
									className="text-[15px] text-foreground/80 hover:text-foreground transition-colors"
								>
									Care guide
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-[15px] text-foreground/80 hover:text-foreground transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<FooterBlogLink />
						</ul>
					</div>

					<FooterCollections />
					<FooterLegalPages />
				</div>

				<div className="flex flex-col-reverse sm:flex-row justify-between gap-4 sm:gap-8 border-t border-foreground/15 pt-6 text-[13px] text-foreground/60">
					<p>© {new Date().getFullYear()} Your Next Store. All rights reserved.</p>
					<p>Designed slowly. Shipped carefully.</p>
				</div>
			</div>
		</footer>
	);
}
