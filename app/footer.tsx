import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { getCategories, getCollections, getStoreName } from "@/lib/catalog";
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
			<Link href="/blog" className="text-base text-foreground hover:underline">
				Stories
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
			<Link href="/contact" className="text-base text-foreground hover:underline">
				Contact
			</Link>
		</li>
	);
}

async function FooterCategories() {
	"use cache";
	cacheLife("hours");

	const categories = await getCategories();
	if (categories.length === 0) {
		return null;
	}

	return (
		<div>
			<h2 className="text-xs text-muted-foreground">Categories</h2>
			<ul className="mt-2 space-y-1">
				{categories.map((category) => (
					<li key={category.id}>
						<Link href={`/category/${category.slug}`} className="text-base text-foreground hover:underline">
							{category.name}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = (await getCollections()).slice(0, 5);

	if (collections.length === 0) {
		return null;
	}

	return (
		<div>
			<h2 className="text-xs text-muted-foreground">Collections</h2>
			<ul className="mt-2 space-y-1">
				{collections.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-base text-foreground hover:underline"
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
			<h2 className="text-xs text-muted-foreground">Legal</h2>
			<ul className="mt-2 space-y-1">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link href={`/legal${page.href}`} className="text-base text-foreground hover:underline">
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

export async function Footer() {
	const [year, storeName, me] = await Promise.all([
		getCopyrightYear(),
		getStoreName(),
		meGetCached().catch(() => null),
	]);
	const description = me?.store.settings?.storeDescription;

	return (
		<footer className="mt-24 border-t border-border bg-background lg:mt-40">
			<div className="px-6">
				<div className="flex flex-col gap-10 py-12 lg:flex-row lg:justify-between">
					<div className="lg:max-w-xs">
						<Link href="/" className="text-[13px] font-extrabold tracking-[0.3em] text-foreground uppercase">
							{storeName}
						</Link>
						<p className="mt-4 text-sm leading-relaxed text-muted-foreground">
							{description || "Colourful, everyday pieces that feel like you."}
						</p>
					</div>

					<div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-4 lg:gap-x-16">
						<div>
							<h2 className="text-xs text-muted-foreground">Menu</h2>
							<ul className="mt-2 space-y-1">
								<li>
									<Link href="/products" className="text-base text-foreground hover:underline">
										Shop
									</Link>
								</li>
								<FooterBlogLink />
								<li>
									<Link href="/about" className="text-base text-foreground hover:underline">
										About
									</Link>
								</li>
								<li>
									<Link href="/faq" className="text-base text-foreground hover:underline">
										FAQ
									</Link>
								</li>
								<FooterContactLink />
							</ul>
						</div>
						<FooterCategories />
						<FooterCollections />
						<FooterLegalPages />
					</div>
				</div>

				<div className="flex flex-col gap-4 border-t border-border py-5 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-sm text-muted-foreground">
						&copy; {year} {storeName}
					</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
