import { cacheLife } from "next/cache";
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
			<h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-foreground mb-6">Products</h3>
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
			<h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-foreground mb-6">Information</h3>
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
		<footer className="bg-primary text-primary-foreground">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
					{/* Brand */}
					<div className="sm:col-span-2 lg:col-span-1">
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-[family-name:var(--font-heading)] text-2xl tracking-wide text-primary-foreground"
						>
							Your Next Store
						</YnsLink>
						<p className="mt-4 text-sm text-primary-foreground/70 leading-relaxed">
							Your Next Store is a specialty tea shop offering premium loose leaf teas. We source directly
							from traditional producers in China, Japan, and beyond — no artificial flavors, no unnecessary
							additives.
						</p>
						{/* Social placeholder */}
						<div className="mt-6 flex gap-4">
							<span className="text-xs text-primary-foreground/50 tracking-[0.15em] uppercase">
								Follow us on social media
							</span>
						</div>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Legal */}
					<FooterLegalPages />

					{/* Contact */}
					<div>
						<h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-primary-foreground mb-6">
							Contact
						</h3>
						<ul className="space-y-3">
							<li>
								<span className="text-sm text-primary-foreground/70">Email: hello@yournextstore.com</span>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-primary-foreground/10">
					<p className="text-xs text-primary-foreground/50 tracking-wide">
						Your Next Store &copy; {new Date().getFullYear()} All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
