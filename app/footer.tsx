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
			<h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-foreground mb-6">Shop</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-muted-foreground hover:text-primary transition-colors"
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
			<h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-foreground mb-6">Legal</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.path}`}
							className="text-sm text-muted-foreground hover:text-primary transition-colors"
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
		<footer className="border-t border-border bg-secondary/30">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-14 sm:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
					{/* Brand */}
					<div className="sm:col-span-2 lg:col-span-1">
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-heading text-xl font-semibold tracking-wide uppercase text-foreground"
						>
							Your Next Store
						</YnsLink>
						<p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
							We create safe, clean beauty products that really work and are designed to make you feel good.
						</p>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Company */}
					<div>
						<h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-foreground mb-6">
							Company
						</h3>
						<ul className="space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/"
									className="text-sm text-muted-foreground hover:text-primary transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/"
									className="text-sm text-muted-foreground hover:text-primary transition-colors"
								>
									Contact
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/"
									className="text-sm text-muted-foreground hover:text-primary transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
						</ul>
					</div>

					{/* Legal */}
					<FooterLegalPages />
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-xs text-muted-foreground tracking-wide">
						&copy; {new Date().getFullYear()} Your Next Store. All rights reserved.
					</p>
					<div className="flex items-center gap-6">
						<span className="text-xs text-muted-foreground">Follow us</span>
						<div className="flex items-center gap-4">
							{["Instagram", "TikTok", "Pinterest"].map((social) => (
								<span
									key={social}
									className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
								>
									{social}
								</span>
							))}
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
