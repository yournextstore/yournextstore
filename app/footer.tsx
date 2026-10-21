import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { hasMembers } from "@/lib/catalog";
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
			<Link href="/blog" className="text-gf-h6 text-muted-foreground transition-colors hover:text-foreground">
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
			<Link
				href="/contact"
				className="text-gf-h6 text-muted-foreground transition-colors hover:text-foreground"
			>
				Contact Us
			</Link>
		</li>
	);
}

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const { data } = await commerce.collectionBrowse({ limit: 5 });
	const collections = { data: data.filter(hasMembers) };

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h2 className="text-gf-h5 font-bold">Collections</h2>
			<ul className="mt-3 space-y-2.5">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-gf-h6 text-muted-foreground transition-colors hover:text-foreground"
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
			<h2 className="text-gf-h5 font-bold">Legal</h2>
			<ul className="mt-3 space-y-2.5">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-gf-h6 text-muted-foreground transition-colors hover:text-foreground"
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

async function getFooterBrand() {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached().catch(() => null);
	return {
		storeName: me?.store.name || "Your Next Store",
		storeDescription: me?.store.settings?.storeDescription?.trim() || null,
	};
}

export async function Footer() {
	const [year, { storeName, storeDescription }] = await Promise.all([getCopyrightYear(), getFooterBrand()]);

	return (
		<footer className="app pt-10 pb-12">
			<div className="rounded-[30px] bg-flash-white p-6">
				<Link href="/" className="text-gf-h4 font-bold">
					{storeName}
				</Link>
				{storeDescription && <p className="mt-2 text-gf-h6 text-muted-foreground">{storeDescription}</p>}
				<div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
					<FooterCollections />
					<div>
						<h2 className="text-gf-h5 font-bold">Store</h2>
						<ul className="mt-3 space-y-2.5">
							<li>
								<Link
									href="/about"
									className="text-gf-h6 text-muted-foreground transition-colors hover:text-foreground"
								>
									About
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link
									href="/faq"
									className="text-gf-h6 text-muted-foreground transition-colors hover:text-foreground"
								>
									FAQ
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>
					<FooterLegalPages />
				</div>
				<div className="mt-8 flex flex-col gap-4 border-t border-light-silver pt-5">
					<PaymentMethods />
					<p className="text-gf-sm text-muted-foreground">
						&copy; {year} {storeName}
					</p>
				</div>
			</div>
		</footer>
	);
}
