import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { Carousel } from "@/components/mandala/carousel";
import { ProductCard } from "@/components/product-card";
import { getBestsellers, getCatalogCategories } from "@/lib/catalog";
import flatLay from "@/public/images/pexels/tote-sunglasses-marble.jpg";

/** The original's "Find the perfect… for every occasion!" block: copy on the left, a flat-lay photograph on the right. */
export function PerfectPiece() {
	return (
		<section className="shell py-20 md:py-24">
			<div className="grid grid-cols-1 gap-y-16 lg:grid-cols-12 lg:gap-x-12">
				<div className="lg:col-span-4">
					<h2 className="text-2xl font-bold leading-8 tracking-tight">
						Find the perfect shoes for every occasion!
					</h2>
					<p className="mt-6 text-sm leading-7 text-[#111827] md:text-[0.9375rem]">
						Whether you&apos;re looking for comfortable sneakers for long city walks, polished leather for the
						office, or something special for a wedding or a big evening, there is a pair here for it. Every
						pair is chosen for how it fits and how it wears, so it feels as right on the first day as it does
						long after.
					</p>
				</div>
				<div className="lg:col-span-8">
					<div className="relative aspect-[7/5] overflow-hidden bg-[#f1f1f1]">
						<Image
							src={flatLay}
							alt="A flat lay of leather oxfords, sneakers, heels and a suede boot on grey paper"
							fill
							placeholder="blur"
							sizes="(max-width: 1024px) 100vw, 750px"
							className="object-cover"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}

/**
 * The original has an agency "Looking for a specialist?" strip between two hairlines here; the
 * port keeps the strip and points it at the store's own categories instead.
 */
export async function CategoryStrip() {
	"use cache";
	cacheLife("minutes");
	const categories = (await getCatalogCategories()).slice(0, 4);

	return (
		<section className="shell py-10 md:py-16">
			<div className="border-y border-border py-12">
				<h2 className="text-2xl font-bold leading-8 tracking-tight">Looking for something specific?</h2>
				<p className="mt-6 text-base leading-7 text-[#111827]">
					{categories.length > 0 ? (
						<>
							Browse{" "}
							{categories.map((category, index) => (
								<Fragment key={category.slug}>
									{index > 0 ? (index === categories.length - 1 ? " or " : ", ") : null}
									<Link
										href={`/category/${category.slug}`}
										className="underline underline-offset-2 hover:text-indigo"
									>
										{category.name.toLocaleLowerCase()}
									</Link>
								</Fragment>
							))}
							, or see{" "}
							<Link href="/products" className="underline underline-offset-2 hover:text-indigo">
								everything in the shop
							</Link>
							.
						</>
					) : (
						<>
							See{" "}
							<Link href="/products" className="underline underline-offset-2 hover:text-indigo">
								everything in the shop
							</Link>
							.
						</>
					)}
				</p>
			</div>
		</section>
	);
}

/** "Our bestsellers!": the original's product carousel, four to a view on desktop and two on phones. */
export async function Bestsellers() {
	"use cache";
	cacheLife("minutes");
	const products = await getBestsellers(10);
	if (products.length === 0) return null;

	return (
		<section className="shell pb-24 pt-14 md:pb-28 md:pt-24">
			<h2 className="text-2xl font-bold leading-8 tracking-tight">Our bestsellers!</h2>
			<p className="mt-6 text-base text-[#111827]">Try them yourself and see why they&apos;re loved.</p>
			<Carousel label="Bestsellers" className="mt-6">
				{products.map((product) => (
					<ProductCard
						key={product.id}
						product={product}
						sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 300px"
					/>
				))}
			</Carousel>
		</section>
	);
}
