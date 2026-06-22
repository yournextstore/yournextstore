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
				className="text-sm text-foreground/80 transition-colors hover:text-saffron"
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
				className="text-sm text-foreground/80 transition-colors hover:text-saffron"
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
			<h3 className="text-[10px] tracking-microcaps text-foreground/55">The Library</h3>
			<ul className="mt-5 space-y-2.5">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-foreground/80 transition-colors hover:text-saffron"
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
			<h3 className="text-[10px] tracking-microcaps text-foreground/55">Fine Print</h3>
			<ul className="mt-5 space-y-2.5">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-foreground/80 transition-colors hover:text-saffron"
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
		<footer className="relative border-t border-foreground/10 bg-ink">
			<div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
				<div className="grid grid-cols-2 gap-10 py-16 sm:grid-cols-4 sm:py-20 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
					<div className="col-span-2 sm:col-span-4 lg:col-span-1">
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-serif-display text-4xl leading-none tracking-wide text-foreground"
						>
							Your Next Store
						</YnsLink>
						<p className="mt-5 max-w-sm text-sm leading-relaxed text-foreground/55">
							An olfactive house publishing fragrance as confession. Six chapters at a time, hand-poured in
							Grasse.
						</p>
						<p className="mt-8 text-[10px] tracking-microcaps text-foreground/35">
							Atelier No. 19 · Grasse, France
						</p>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-[10px] tracking-microcaps text-foreground/55">Counter</h3>
						<ul className="mt-5 space-y-2.5">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-foreground/80 transition-colors hover:text-saffron"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-foreground/80 transition-colors hover:text-saffron"
								>
									FAQ
								</YnsLink>
							</li>
							<FooterBlogLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-foreground/80 transition-colors hover:text-saffron"
								>
									Sample set
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-foreground/80 transition-colors hover:text-saffron"
								>
									Stockists
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-foreground/80 transition-colors hover:text-saffron"
								>
									Press
								</YnsLink>
							</li>
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="flex flex-col gap-3 border-t border-foreground/10 py-6 text-[10px] tracking-microcaps text-foreground/40 sm:flex-row sm:items-center sm:justify-between">
					<p>© {new Date().getFullYear()} Your Next Store — All Confessions Reserved</p>
					<p>An Olfactive Anthology · Vol. {new Date().getFullYear() - 2018}</p>
				</div>
			</div>
		</footer>
	);
}
