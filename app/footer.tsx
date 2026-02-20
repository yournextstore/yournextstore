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
			<h3 className="text-sm font-extrabold uppercase tracking-widest text-white mb-6">Quick Links</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-white/60 hover:text-brand-yellow transition-colors"
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
			<h3 className="text-sm font-extrabold uppercase tracking-widest text-white mb-6">Legal</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.path}`}
							className="text-sm text-white/60 hover:text-brand-yellow transition-colors"
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
		<footer className="bg-brand-dark text-white">
			{/* Social bar */}
			<div className="border-b border-white/10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-wrap items-center justify-center gap-6">
					{["Instagram", "Facebook", "TikTok", "YouTube", "Pinterest"].map((social) => (
						<span
							key={social}
							className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-brand-yellow transition-colors cursor-pointer"
						>
							{social}
						</span>
					))}
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Brand */}
					<div>
						<h3 className="text-sm font-extrabold uppercase tracking-widest text-white mb-6">Information</h3>
						<p className="text-sm text-white/60 leading-relaxed">
							Your Next Store — Scandinavian streetwear, conscious fashion since 1995. Quality products,
							thoughtfully designed.
						</p>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Legal */}
					<FooterLegalPages />

					{/* Social */}
					<div>
						<h3 className="text-sm font-extrabold uppercase tracking-widest text-white mb-6">Follow Us</h3>
						<div className="flex flex-wrap gap-3">
							{["Discord", "Email", "Facebook", "Instagram"].map((social) => (
								<span
									key={social}
									className="text-sm text-white/60 hover:text-brand-yellow transition-colors cursor-pointer"
								>
									{social}
								</span>
							))}
						</div>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
					<p className="text-xs text-white/40">
						&copy; {new Date().getFullYear()} Your Next Store. All rights reserved.
					</p>
					<div className="flex gap-4">
						{["Visa", "Mastercard", "Apple Pay", "Google Pay"].map((method) => (
							<span key={method} className="text-xs text-white/30 font-medium">
								{method}
							</span>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}
