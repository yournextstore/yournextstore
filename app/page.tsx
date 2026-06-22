import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { YnsLink } from "@/components/yns-link";
import { isPreview, previewHref } from "@/lib/demo-products";

function ProductGridSkeleton() {
	return (
		<section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[3/4] bg-secondary animate-pulse" />
						<div className="mt-4 space-y-2">
							<div className="h-3 w-1/3 bg-secondary animate-pulse" />
							<div className="h-4 w-3/4 bg-secondary animate-pulse" />
							<div className="h-4 w-1/4 bg-secondary animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

function EditorialFeature({ preview }: { preview: boolean }) {
	const href = previewHref("/collection/women", preview);
	return (
		<section className="bg-background">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
					<div className="lg:col-span-7 relative aspect-[16/10] gallery-frame overflow-hidden">
						<Image
							src="/scraped-2.jpg"
							alt="Accessories edit — flat lay on pale lavender"
							fill
							sizes="(max-width: 1024px) 100vw, 60vw"
							className="object-cover"
						/>
						<div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 text-white">
							<p className="text-[10px] uppercase tracking-[0.22em] opacity-90">Chapter 03</p>
							<p className="font-display text-2xl sm:text-3xl mt-2 max-w-xs leading-tight">
								Accessories, quietly considered.
							</p>
						</div>
					</div>
					<div className="lg:col-span-5 flex flex-col justify-end">
						<p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">The Edit</p>
						<h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-light leading-[1.05] tracking-tight">
							Cropped silhouettes, in lilac and ivory.
						</h2>
						<p className="mt-5 text-base text-muted-foreground leading-relaxed">
							Six pieces, three palettes, one mood — the season&rsquo;s most-considered cuts in cotton, silk
							and structured denim. Hand-finished by ateliers in Milan and Paris.
						</p>
						<YnsLink
							prefetch="eager"
							href={href}
							className="mt-8 inline-flex items-center self-start text-[11px] uppercase tracking-[0.22em] text-foreground border-b border-foreground pb-1 hover:opacity-70 transition-opacity"
						>
							Discover the edit
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}

function CategoryStrip({ preview }: { preview: boolean }) {
	const cats = [
		{ label: "Shirts", img: "/scraped-0.jpg", slug: "women" },
		{ label: "Trousers", img: "/scraped-1.jpg", slug: "women" },
		{ label: "Accessories", img: "/scraped-2.jpg", slug: "brands" },
		{ label: "Footwear", img: "/scraped-5.jpg", slug: "brands" },
	];

	return (
		<section className="bg-background">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
				<div className="flex items-end justify-between mb-8 sm:mb-10 border-t border-border pt-8">
					<div>
						<h2 className="font-display text-3xl sm:text-4xl font-light tracking-tight">By the Category</h2>
						<p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Spring · 2026</p>
					</div>
				</div>
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6">
					{cats.map((cat) => (
						<YnsLink
							key={cat.label}
							href={previewHref(`/collection/${cat.slug}`, preview)}
							className="group block"
						>
							<div className="relative aspect-[3/4] gallery-frame overflow-hidden">
								<Image
									src={cat.img}
									alt={cat.label}
									fill
									sizes="(max-width: 1024px) 50vw, 25vw"
									className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
								/>
								<div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
								<div className="absolute bottom-4 left-4 text-white text-[11px] uppercase tracking-[0.22em] font-medium">
									{cat.label}
								</div>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}

export async function generateMetadata({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
	const sp = await searchParams;
	const preview = await isPreview(sp);
	if (preview) {
		return { robots: { index: false, follow: false } };
	}
	return {};
}

export default async function Home({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
	const sp = await searchParams;
	const preview = await isPreview(sp);

	return (
		<main>
			<Hero previewMode={preview} />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid
					title="The New Edit"
					description="Spring · 2026 · 28 pieces"
					limit={8}
					previewMode={preview}
					columns={4}
				/>
			</Suspense>
			<EditorialFeature preview={preview} />
			<CategoryStrip preview={preview} />
			<About />
			<Newsletter />
		</main>
	);
}
