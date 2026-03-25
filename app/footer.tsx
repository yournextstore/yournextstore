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
			<h3 className="mb-5 text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">Collections</h3>
			<ul className="space-y-2.5">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-foreground/78 transition-colors hover:text-foreground"
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
			<h3 className="mb-5 text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">Information</h3>
			<ul className="space-y-2.5">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.path}`}
							className="text-sm text-foreground/78 transition-colors hover:text-foreground"
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
		<footer className="border-t border-border/80 bg-[var(--surface-soft)]">
			<div className="section-shell grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,0.75fr))]">
				<div className="max-w-sm space-y-6">
					<YnsLink prefetch={"eager"} href="/" className="font-editorial text-3xl tracking-[-0.04em]">
						Vela
					</YnsLink>
					<p className="text-sm leading-7 text-muted-foreground">
						Furniture, lighting, and objects selected for rooms that feel warm, quiet, and lived in.
					</p>
					<div className="flex flex-wrap gap-x-6 gap-y-2 text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">
						<YnsLink prefetch={"eager"} href="/products" className="transition-colors hover:text-foreground">
							Shop the edit
						</YnsLink>
						<YnsLink prefetch={"eager"} href="/search" className="transition-colors hover:text-foreground">
							Search
						</YnsLink>
						<YnsLink prefetch={"eager"} href="/faq" className="transition-colors hover:text-foreground">
							Client services
						</YnsLink>
					</div>
				</div>

				<div>
					<FooterCollections />
				</div>
				<div>
					<h3 className="mb-5 text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground">
						Client Services
					</h3>
					<ul className="space-y-2.5">
						{[
							{ label: "Search the catalog", href: "/search" },
							{ label: "Frequently asked questions", href: "/faq" },
							{ label: "All products", href: "/products" },
						].map((link) => (
							<li key={link.label}>
								<YnsLink
									prefetch={"eager"}
									href={link.href}
									className="text-sm text-foreground/78 transition-colors hover:text-foreground"
								>
									{link.label}
								</YnsLink>
							</li>
						))}
					</ul>
				</div>
				<FooterLegalPages />
			</div>

			<div className="page-shell flex flex-col items-start justify-between gap-3 border-t border-border/80 py-5 text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground sm:flex-row sm:items-center">
				<p>&copy; {new Date().getFullYear()} Vela. All rights reserved.</p>
				<a
					href="#newsletter"
					className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
				>
					Join the list
					<ArrowUp className="h-3.5 w-3.5 rotate-45" />
				</a>
			</div>
		</footer>
	);
}
