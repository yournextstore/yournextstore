import { ArrowUp } from "lucide-react";
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
			<h3 className="text-xs font-medium uppercase tracking-[0.15em] text-foreground mb-5">Collections</h3>
			<ul className="space-y-2.5">
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
			<h3 className="text-xs font-medium uppercase tracking-[0.15em] text-foreground mb-5">Information</h3>
			<ul className="space-y-2.5">
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
		<footer className="border-t border-border bg-background">
			{/* Back to top */}
			<div className="flex justify-center -mt-5">
				<a
					href="#"
					className="bg-background border border-border px-4 py-2 text-xs font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5"
				>
					Top
					<ArrowUp className="h-3 w-3" />
				</a>
			</div>

			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
					{/* Collections */}
					<FooterCollections />

					{/* Navigate */}
					<div>
						<h3 className="text-xs font-medium uppercase tracking-[0.15em] text-foreground mb-5">Navigate</h3>
						<ul className="space-y-2.5">
							{[
								{ label: "Search", href: "/search" },
								{ label: "Our Story", href: "/products" },
								{ label: "Contact Us", href: "/products" },
							].map((link) => (
								<li key={link.label}>
									<YnsLink
										prefetch={"eager"}
										href={link.href}
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										{link.label}
									</YnsLink>
								</li>
							))}
						</ul>
					</div>

					{/* Legal / Information */}
					<FooterLegalPages />

					{/* Follow */}
					<div>
						<h3 className="text-xs font-medium uppercase tracking-[0.15em] text-foreground mb-5">
							Follow us
						</h3>
						<div className="flex gap-4">
							{["Instagram", "Pinterest", "TikTok"].map((social) => (
								<span
									key={social}
									className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
								>
									{social}
								</span>
							))}
						</div>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-xs text-muted-foreground">
						&copy; {new Date().getFullYear()} Your Next Store. All rights reserved.
					</p>
					<YnsLink
						prefetch={"eager"}
						href="/"
						className="text-lg tracking-tight"
						style={{ fontFamily: "var(--font-heading)" }}
					>
						FORMA
					</YnsLink>
				</div>
			</div>
		</footer>
	);
}
