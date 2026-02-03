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
			<p className="text-xs tracking-[0.2em] uppercase text-zinc-400 mb-6">Collections</p>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors font-light"
						>
							{collection.name}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

export function Footer() {
	return (
		<footer className="bg-[#FAFAF8]">
			{/* Top border */}
			<div className="h-px w-full bg-zinc-200" />

			<div className="max-w-7xl mx-auto px-8 lg:px-16">
				{/* Main footer content */}
				<div className="py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-16">
					{/* Brand section */}
					<div className="lg:col-span-5">
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="text-xs tracking-[0.3em] uppercase text-zinc-900"
						>
							Your Next Store
						</YnsLink>
						<p className="mt-8 text-sm text-zinc-500 leading-relaxed font-light max-w-sm">
							Curated essentials for modern living. Quality products, thoughtfully designed.
						</p>
					</div>

					{/* Navigation columns */}
					<div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12">
						<FooterCollections />

						<div>
							<p className="text-xs tracking-[0.2em] uppercase text-zinc-400 mb-6">Information</p>
							<ul className="space-y-3">
								<li>
									<YnsLink
										prefetch={"eager"}
										href="/about"
										className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors font-light"
									>
										About
									</YnsLink>
								</li>
								<li>
									<YnsLink
										prefetch={"eager"}
										href="/contact"
										className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors font-light"
									>
										Contact
									</YnsLink>
								</li>
								<li>
									<YnsLink
										prefetch={"eager"}
										href="/shipping"
										className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors font-light"
									>
										Shipping
									</YnsLink>
								</li>
							</ul>
						</div>

						<div>
							<p className="text-xs tracking-[0.2em] uppercase text-zinc-400 mb-6">Connect</p>
							<ul className="space-y-3">
								<li>
									<a
										href="#"
										className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors font-light"
									>
										Instagram
									</a>
								</li>
								<li>
									<a
										href="#"
										className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors font-light"
									>
										Twitter
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="h-px w-full bg-zinc-200" />
				<div className="py-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<p className="text-xs text-zinc-400 tracking-wide">
						{new Date().getFullYear()} Your Next Store
					</p>
					<p className="text-xs text-zinc-400 tracking-wide">
						All rights reserved
					</p>
				</div>
			</div>
		</footer>
	);
}
