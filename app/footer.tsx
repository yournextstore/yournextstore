import { cacheLife } from "next/cache";
import { NewsletterForm } from "@/components/newsletter-form";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="text-sm font-bold uppercase tracking-wide text-foreground mb-4">Shop</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
			<h3 className="text-sm font-bold uppercase tracking-wide text-foreground mb-4">Info</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.path}`}
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							{page.title}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

export function Footer() {
	return (
		<footer className="border-t-[3px] border-foreground bg-background">
			<div className="max-w-[1820px] mx-auto px-5 sm:px-8 lg:px-10">
				<div className="py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Brand */}
					<div>
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-[family-name:var(--font-prompt)] text-2xl font-black uppercase tracking-tight text-foreground"
						>
							Your Next Store
						</YnsLink>
						<p className="mt-4 text-sm text-muted-foreground leading-relaxed">
							Everyday pantry goods for the everyday chef. Quality sauces, spices, and seasonings.
						</p>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Legal */}
					<FooterLegalPages />

					{/* Newsletter in footer */}
					<div>
						<h3 className="text-sm font-bold uppercase tracking-wide text-foreground mb-4">Stay in touch</h3>
						<p className="text-sm text-muted-foreground mb-4">
							Receive special offers and first look at new products.
						</p>
						<NewsletterForm compact />
					</div>
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t-[3px] border-foreground flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-sm text-muted-foreground">
						&copy; {new Date().getFullYear()} Your Next Store. All rights reserved.
					</p>
					<div className="flex items-center gap-4">
						<span className="text-xs text-muted-foreground">Visa</span>
						<span className="text-xs text-muted-foreground">Mastercard</span>
						<span className="text-xs text-muted-foreground">PayPal</span>
						<span className="text-xs text-muted-foreground">Amex</span>
					</div>
				</div>
			</div>
		</footer>
	);
}
