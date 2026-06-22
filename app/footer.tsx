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
				className="font-editorial italic text-base text-foreground/80 hover:text-accent transition-colors"
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
				className="font-editorial italic text-base text-foreground/80 hover:text-accent transition-colors"
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
			<h3 className="font-grotesk text-[10px] uppercase tracking-eyebrow text-muted-foreground">
				<span className="text-accent/80">(</span>
				<span className="px-1">the menu</span>
				<span className="text-accent/80">)</span>
			</h3>
			<ul className="mt-5 space-y-2.5">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="font-editorial italic text-base text-foreground/80 hover:text-accent transition-colors"
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
			<h3 className="font-grotesk text-[10px] uppercase tracking-eyebrow text-muted-foreground">
				<span className="text-accent/80">(</span>
				<span className="px-1">fine print</span>
				<span className="text-accent/80">)</span>
			</h3>
			<ul className="mt-5 space-y-2.5">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="font-editorial italic text-base text-foreground/80 hover:text-accent transition-colors"
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
		<footer className="relative border-t border-border bg-background">
			<div className="max-w-[1400px] mx-auto px-6 lg:px-10">
				{/* Oversized editorial wordmark */}
				<div className="pt-16 pb-10 border-b border-border/60">
					<div className="font-grotesk text-[10px] uppercase tracking-eyebrow text-muted-foreground mb-4 flex items-center gap-3">
						<span aria-hidden className="block h-px w-8 bg-foreground" />
						colophon
					</div>
					<div className="font-editorial italic font-light text-[clamp(3rem,11vw,10rem)] leading-[0.9] tracking-tight text-foreground/90 select-none">
						Your <span className="not-italic">Next</span> Store.
					</div>
				</div>

				<div className="py-12 sm:py-16 grid grid-cols-12 gap-8">
					{/* Brand */}
					<div className="col-span-12 md:col-span-5">
						<div className="font-grotesk text-[10px] uppercase tracking-eyebrow text-muted-foreground">
							<span className="text-accent/80">(</span>
							<span className="px-1">est. 1955</span>
							<span className="text-accent/80">)</span>
						</div>
						<p className="mt-5 font-grotesk text-sm text-muted-foreground leading-relaxed max-w-sm">
							A small editorial gallery for sculptural seating, hand-polished brass and quiet objects. The
							next store you&apos;ll keep open in a tab.
						</p>
						<div className="mt-6 inline-flex items-center gap-3 font-grotesk text-[10px] uppercase tracking-eyebrow text-foreground">
							<span aria-hidden className="block h-px w-6 bg-foreground" />
							copenhagen — new york
						</div>
					</div>

					<div className="col-span-6 md:col-span-2">
						<FooterCollections />
					</div>

					<div className="col-span-6 md:col-span-2">
						<h3 className="font-grotesk text-[10px] uppercase tracking-eyebrow text-muted-foreground">
							<span className="text-accent/80">(</span>
							<span className="px-1">support</span>
							<span className="text-accent/80">)</span>
						</h3>
						<ul className="mt-5 space-y-2.5">
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
									className="font-editorial italic text-base text-foreground/80 hover:text-accent transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="font-editorial italic text-base text-foreground/80 hover:text-accent transition-colors"
								>
									the archive
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<div className="col-span-12 md:col-span-3">
						<FooterLegalPages />
					</div>
				</div>

				<div className="py-6 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
					<p className="font-grotesk text-[10px] uppercase tracking-eyebrow text-muted-foreground">
						© {new Date().getFullYear()} — Your Next Store. All quietly reserved.
					</p>
					<p className="font-grotesk text-[10px] uppercase tracking-eyebrow text-muted-foreground">
						set in fraunces &amp; inter
					</p>
				</div>
			</div>
		</footer>
	);
}
