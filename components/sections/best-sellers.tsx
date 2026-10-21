import Link from "next/link";
import { Em } from "@/components/brand/em";
import { FamilyDot } from "@/components/brand/family-dot";
import { ArrowRightIcon } from "@/components/icons";
import { NotesList } from "@/components/notes";
import type { ShowcaseProduct } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

function Photo({ product, sizes }: { product: ShowcaseProduct; sizes: string }) {
	if (!product.image) return null;
	return (
		<YNSMedia
			src={product.image}
			alt=""
			fill
			sizes={sizes}
			className="object-cover transition-transform duration-700 ease-[var(--ease-out-quart)] group-hover:scale-[1.03]"
		/>
	);
}

function price(product: ShowcaseProduct) {
	return product.soldOut ? "Sold out" : product.priceFrom;
}

function FeaturedTile({ product }: { product: ShowcaseProduct }) {
	return (
		<li className="sm:col-span-2 lg:col-span-2 lg:row-span-2">
			<Link
				href={`/product/${product.slug}`}
				className="group relative block h-full min-h-[32rem] overflow-hidden rounded-xl border border-line"
			>
				<Photo product={product} sizes="(min-width: 1024px) 50vw, 100vw" />
				<div
					aria-hidden="true"
					className="absolute inset-0 bg-gradient-to-t from-page/85 via-transparent to-page/10"
				/>
				<div className="absolute inset-x-4 bottom-4 md:inset-x-5 md:bottom-5">
					<div className="glass bg-page/45 p-5 md:p-6">
						<div className="flex items-start justify-between gap-4">
							<div className="min-w-0">
								<h3 className="font-display text-title-md">{product.name}</h3>
								{product.summary && (
									<p className="mt-1 line-clamp-2 text-sm text-ink/80">{product.summary}</p>
								)}
							</div>
							<span className="shrink-0 text-sm">{price(product)}</span>
						</div>
						{product.notes && (
							<NotesList
								notes={product.notes}
								layout="columns"
								className="mt-5 border-t border-ink/15 pt-4"
							/>
						)}
					</div>
				</div>
			</Link>
		</li>
	);
}

function SmallTile({ product, wide }: { product: ShowcaseProduct; wide?: boolean }) {
	return (
		<li className={wide ? "sm:col-span-2 lg:col-span-2" : undefined}>
			<Link
				href={`/product/${product.slug}`}
				className={cn(
					"group relative block h-full min-h-[15rem] overflow-hidden rounded-xl border border-line transition-colors hover:border-gold/60",
					wide && "bg-surface",
				)}
			>
				<div className={cn("absolute inset-y-0 left-0 overflow-hidden", wide ? "w-1/2" : "right-0")}>
					<Photo
						product={product}
						sizes={
							wide
								? "(min-width: 1024px) 25vw, 50vw"
								: "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
						}
					/>
				</div>
				{!wide && (
					<div
						aria-hidden="true"
						className="absolute inset-0 bg-gradient-to-t from-page/95 via-page/20 to-transparent"
					/>
				)}
				<div
					className={cn(
						"absolute",
						wide
							? "inset-y-0 right-0 flex w-1/2 flex-col justify-center gap-2 p-6"
							: "inset-x-0 bottom-0 p-5",
					)}
				>
					<div className="flex items-center gap-2">
						{product.tone !== undefined && <FamilyDot index={product.tone} />}
						<h3 className={cn("font-display", wide ? "text-title-sm" : "text-lg leading-tight")}>
							{product.name}
						</h3>
					</div>
					{wide && product.summary && <p className="line-clamp-3 text-sm text-ink/75">{product.summary}</p>}
					<p className="flex items-center justify-between gap-3 text-sm">
						<span>{price(product)}</span>
						<ArrowRightIcon
							width={16}
							height={16}
							className="text-gold transition-transform group-hover:translate-x-1"
						/>
					</p>
				</div>
			</Link>
		</li>
	);
}

export function BestSellers({ products }: { products: ShowcaseProduct[] }) {
	const [featured, second, third, fourth] = products;
	if (!featured) return null;
	return (
		<section className="border-t border-line bg-surface py-24 md:py-32">
			<div className="container-page">
				<div className="flex flex-wrap items-end justify-between gap-6">
					<h2 className="font-display text-title-lg md:text-title-xl">
						Best <Em>sellers</Em>
					</h2>
					<Link href="/products" className="btn-line">
						View the full shelf
					</Link>
				</div>
				<ul className="mt-12 grid gap-4 sm:auto-rows-[minmax(15rem,auto)] sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[15rem_15rem]">
					<FeaturedTile product={featured} />
					{second && <SmallTile product={second} />}
					{third && <SmallTile product={third} />}
					{fourth && <SmallTile product={fourth} wide />}
				</ul>
			</div>
		</section>
	);
}
