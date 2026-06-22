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
				className="text-sm text-foreground/70 hover:text-foreground transition-colors"
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
				className="text-sm text-foreground/70 hover:text-foreground transition-colors"
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
			<h3 className="text-[11px] tracking-[0.22em] uppercase text-foreground/50 mb-5">Collections</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="display-italic text-lg text-foreground/80 hover:text-foreground transition-colors"
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
			<h3 className="text-[11px] tracking-[0.22em] uppercase text-foreground/50 mb-5">Legal</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-foreground/70 hover:text-foreground transition-colors"
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
		<footer className="border-t border-foreground/15" style={{ backgroundColor: "#F4F1EC" }}>
			<div className="max-w-[1400px] mx-auto px-6 lg:px-10">
				{/* Massive wordmark */}
				<div className="pt-16 pb-10 border-b border-foreground/15">
					<div className="display-italic text-[18vw] lg:text-[10vw] leading-[0.85] tracking-[-0.04em] text-foreground/90">
						Your Next
						<br />
						<span className="pl-[6vw]" style={{ color: "#c97a2b" }}>
							Store
						</span>
						<span className="align-baseline text-[0.18em] tracking-[0.18em] uppercase font-sans not-italic text-foreground/40 ml-4">
							est. ’25
						</span>
					</div>
				</div>

				<div className="py-16 grid grid-cols-12 gap-8">
					<div className="col-span-12 lg:col-span-4">
						<div className="flex items-center gap-2 mb-5">
							<span className="block h-2 w-2 rounded-full bg-foreground" />
							<span className="text-[12px] tracking-[0.22em] uppercase font-medium">Your Next Store</span>
						</div>
						<p className="text-sm text-foreground/70 leading-relaxed max-w-sm">
							An editorial house for considered design objects. Drawn for the long view.
						</p>
						<div className="mt-8 flex items-center gap-3 text-[11px] tracking-[0.22em] uppercase text-foreground/50">
							<span>Copenhagen</span>
							<span className="block h-px w-6 bg-foreground/30" />
							<span>New York</span>
							<span className="block h-px w-6 bg-foreground/30" />
							<span>Kyoto</span>
						</div>
					</div>

					<div className="col-span-6 sm:col-span-4 lg:col-span-3">
						<FooterCollections />
					</div>

					<div className="col-span-6 sm:col-span-4 lg:col-span-2">
						<h3 className="text-[11px] tracking-[0.22em] uppercase text-foreground/50 mb-5">Studio</h3>
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
									className="text-sm text-foreground/70 hover:text-foreground transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-foreground/70 hover:text-foreground transition-colors"
								>
									Catalogue
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<div className="col-span-12 sm:col-span-4 lg:col-span-3">
						<FooterLegalPages />
					</div>
				</div>

				<div className="py-6 border-t border-foreground/15 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between text-[11px] tracking-[0.18em] uppercase text-foreground/50">
					<p>© {new Date().getFullYear()} Your Next Store · All rights reserved</p>
					<p>(&nbsp;Drawn with care&nbsp;)</p>
				</div>
			</div>
		</footer>
	);
}
