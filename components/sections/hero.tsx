import { ArrowRightIcon } from "lucide-react";
import { cacheLife } from "next/cache";
import Image from "next/image";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

export async function Hero() {
	"use cache";
	cacheLife("minutes");

	const { data: products } = await commerce.productBrowse({ active: true, limit: 1 });
	const firstProduct = products[0];
	const productImage = firstProduct?.images?.[0] ?? firstProduct?.variants?.[0]?.images?.[0];
	return (
		<section className="relative min-h-[100vh] flex items-center bg-[#FAFAF8]">
			{/* Minimal geometric accent - Danish museum style */}
			<div className="absolute top-0 left-0 w-full h-px bg-zinc-200" />
			<div className="absolute bottom-0 left-0 w-full h-px bg-zinc-200" />

			{/* Vertical line accent */}
			<div className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-zinc-200" />

			<div className="relative w-full max-w-7xl mx-auto px-8 lg:px-16">
				<div className="py-24 lg:py-40 grid lg:grid-cols-12 gap-8 lg:gap-16 items-end">
					{/* Left content - spans 7 columns */}
					<div className="lg:col-span-7">
						{/* Small caps eyebrow */}
						<p className="text-xs tracking-[0.3em] uppercase text-zinc-400 mb-12">
							Est. 2024
						</p>

						<h1 className="text-5xl sm:text-6xl lg:text-8xl font-light tracking-[-0.03em] text-zinc-900 leading-[0.95]">
							Your Life
							<br />
							Organised
						</h1>

						<div className="mt-16 max-w-md">
							<p className="text-base text-zinc-500 leading-relaxed font-light">
								Thoughtfully crafted furniture for contemporary spaces.
								Timeless designs that blend form and function for everyday comfort.
							</p>
						</div>

						<div className="mt-16 flex items-center gap-12">
							<YnsLink
								prefetch={"eager"}
								href="#products"
								className="group inline-flex items-center gap-4 text-sm tracking-wide text-zinc-900 hover:text-zinc-600 transition-colors"
							>
								<span className="uppercase tracking-[0.15em]">Explore</span>
								<ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
							</YnsLink>
							<span className="w-px h-4 bg-zinc-300" />
							<YnsLink
								prefetch={"eager"}
								href="#about"
								className="text-sm tracking-[0.15em] uppercase text-zinc-400 hover:text-zinc-900 transition-colors"
							>
								Learn More
							</YnsLink>
						</div>
					</div>

					{/* Right side - featured product */}
					<div className="lg:col-span-5 flex items-end justify-end">
						<YnsLink href={firstProduct ? `/product/${firstProduct.slug}` : "#products"} className="relative group">
							{/* Product image */}
							<div className="w-64 lg:w-80 aspect-[3/4] bg-zinc-100 overflow-hidden">
								{productImage ? (
									<Image
										src={productImage}
										alt={firstProduct?.name ?? "Featured product"}
										fill
										sizes="(max-width: 1024px) 256px, 320px"
										className="object-cover transition-transform duration-700 group-hover:scale-105"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center">
										<div className="w-20 lg:w-24 aspect-square bg-zinc-900 rounded-t-full" />
									</div>
								)}
							</div>
							{/* Caption */}
							<p className="mt-6 text-xs tracking-[0.2em] uppercase text-zinc-400 text-right">
								01 / {firstProduct?.name ?? "Featured"}
							</p>
						</YnsLink>
					</div>
				</div>

				{/* Bottom details - museum-like metadata */}
				<div className="absolute bottom-8 left-8 lg:left-16 right-8 lg:right-16 flex justify-between items-end">
					<div className="flex gap-12">
						<div>
							<p className="text-xs tracking-[0.2em] uppercase text-zinc-400 mb-1">Homes</p>
							<p className="text-sm text-zinc-900 font-light">25,000+</p>
						</div>
						<div>
							<p className="text-xs tracking-[0.2em] uppercase text-zinc-400 mb-1">Crafted</p>
							<p className="text-sm text-zinc-900 font-light">Since 2024</p>
						</div>
					</div>
					<p className="text-xs tracking-[0.2em] uppercase text-zinc-400">
						Scroll
					</p>
				</div>
			</div>
		</section>
	);
}
