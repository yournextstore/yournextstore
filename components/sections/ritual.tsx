import { ArrowRight, Leaf } from "lucide-react";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { getCatalogStats } from "@/lib/catalog";

// The original's "Special Deal" band keeps its landscape photograph and big numerals, but counts
// what the store actually holds instead of a fake deadline.
export async function Ritual() {
	"use cache";
	cacheLife("minutes");
	const stats = await getCatalogStats();
	const measures = [
		{ value: stats.products, label: stats.products === 1 ? "Product" : "Products" },
		{ value: stats.categories, label: stats.categories === 1 ? "Category" : "Categories" },
		{ value: stats.collections, label: stats.collections === 1 ? "Collection" : "Collections" },
	].filter((measure) => measure.value > 0);

	return (
		<section className="relative overflow-hidden py-24 lg:py-32">
			<Image src="/images/pexels/tv-band-hills.jpg" alt="" fill sizes="100vw" className="object-cover" />
			<div className="absolute inset-0 bg-[hsl(160_27%_22%/0.84)]" />
			<div className="wrapper relative z-10 text-center">
				<p className="mb-4 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-accent">
					<Leaf aria-hidden="true" className="size-4" />
					The Daily Ritual
				</p>
				<h2 className="mx-auto mb-6 max-w-2xl font-display text-3xl font-bold leading-tight text-hero-ink sm:text-4xl lg:text-5xl">
					A Calmer Cup Awaits
				</h2>
				<p className="mx-auto mb-10 max-w-lg text-lg font-light text-hero-ink/80">
					Every tea and teapot on our shelf, counted plainly and gathered in one place, ready whenever you
					are.
				</p>
				<ul className="mb-10 flex items-start justify-center gap-3 sm:gap-6 lg:gap-8">
					{measures.map((measure, index) => (
						<li key={measure.label} className="flex items-start gap-3 sm:gap-6 lg:gap-8">
							{index > 0 && (
								<span aria-hidden="true" className="text-2xl font-light text-hero-ink/40 sm:text-3xl">
									:
								</span>
							)}
							<p className="flex flex-col-reverse items-center">
								<span className="mt-1.5 text-[10px] uppercase tracking-widest text-hero-ink/75 sm:text-xs">
									{measure.label}
								</span>
								<span className="text-3xl font-bold leading-none tabular-nums text-hero-ink sm:text-4xl lg:text-5xl">
									{String(measure.value).padStart(2, "0")}
								</span>
							</p>
						</li>
					))}
				</ul>
				<Link
					href="/products"
					className="inline-flex items-center bg-accent px-8 py-4 text-sm font-medium uppercase tracking-widest text-accent-foreground transition-colors hover:bg-accent/85"
				>
					Explore the Teas
					<ArrowRight aria-hidden="true" className="ml-2 size-4" />
				</Link>
			</div>
		</section>
	);
}
