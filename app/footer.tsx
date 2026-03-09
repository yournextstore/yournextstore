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
			<h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground mb-5">
				Collections
			</h4>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
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
			<h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground mb-5">
				Quick links
			</h4>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.path}`}
							className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
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
		<footer className="bg-foreground text-primary-foreground">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-14 sm:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
					{/* Brand / Mission */}
					<div>
						<h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground mb-5">
							Our mission
						</h4>
						<p className="text-sm text-primary-foreground/60 leading-relaxed">
							To honor and challenge traditional perceptions of fashion, merging function with contemporary
							style.
						</p>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Legal */}
					<FooterLegalPages />

					{/* Follow */}
					<div>
						<h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground mb-5">
							Follow us
						</h4>
						<div className="flex gap-4">
							{["Twitter", "Facebook", "Pinterest"].map((social) => (
								<span
									key={social}
									className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors cursor-pointer"
								>
									{social}
								</span>
							))}
						</div>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-primary-foreground/10">
					<p className="text-xs text-primary-foreground/40">
						Copyright &copy; {new Date().getFullYear()} Your Next Store
					</p>
				</div>
			</div>
		</footer>
	);
}
