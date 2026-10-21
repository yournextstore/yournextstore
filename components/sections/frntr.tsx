import Link from "next/link";
import type { ReactNode } from "react";
import { type CardProduct, ProductCard } from "@/components/product-card";
import { ProductRail } from "@/components/product-rail";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

/** Section title + lead paragraph, as the original prints above every slider. */
export function SectionIntro({
	title,
	text,
	as: Heading = "h2",
	className,
}: {
	title: string;
	text?: string | null;
	as?: "h1" | "h2";
	className?: string;
}) {
	return (
		<div className={cn("mb-8 max-w-[600px] lg:mb-10", className)}>
			<Heading className="text-[28px] leading-tight font-semibold text-foreground sm:text-[32px]">
				{title}
			</Heading>
			{text && <p className="mt-3 text-base leading-[1.9] text-muted-foreground sm:text-lg">{text}</p>}
		</div>
	);
}

/** The full-width photograph with white type laid over its left half. */
export function Banner({
	image,
	title,
	text,
	href,
	cta,
	priority = false,
	as: Heading = "h2",
	className,
}: {
	image?: string;
	title: string;
	text?: string | null;
	href?: string;
	cta?: string;
	priority?: boolean;
	as?: "h1" | "h2";
	className?: string;
}) {
	return (
		<section
			className={cn(
				"relative isolate flex min-h-[350px] items-center overflow-hidden border border-border bg-[#3a3532] sm:min-h-[460px] lg:min-h-[600px]",
				className,
			)}
		>
			{image && (
				<YNSMedia
					src={image}
					alt=""
					fill
					priority={priority}
					sizes="(max-width: 1264px) 100vw, 1232px"
					className="-z-10 object-cover"
				/>
			)}
			<div
				aria-hidden="true"
				className="absolute inset-0 -z-10 bg-linear-to-r from-black/65 via-black/35 to-black/0"
			/>
			<div className="max-w-[640px] px-5 py-12 sm:px-12 lg:px-[70px]">
				<Heading className="text-[28px] leading-[1.1] font-semibold text-white sm:text-[32px]">
					{title}
				</Heading>
				{text && <p className="mt-4 text-lg leading-[1.85] text-white sm:text-xl">{text}</p>}
				{href && cta && (
					<Link
						href={href}
						className="mt-4 inline-flex h-9 items-center rounded-xs bg-white px-4 text-base font-bold text-foreground transition-colors hover:bg-peach"
					>
						{cta}
					</Link>
				)}
			</div>
		</section>
	);
}

/** A titled slider of product tiles. */
export function RailSection({
	title,
	text,
	products,
	className,
	framed = true,
}: {
	title: string;
	text?: string | null;
	products: CardProduct[];
	className?: string;
	/** False when the parent already applies the page frame. */
	framed?: boolean;
}) {
	if (products.length === 0) return null;
	const items: ReactNode[] = products.map((product) => (
		<ProductCard
			key={product.id}
			product={product}
			imageClassName="aspect-[11/12]"
			sizes="(max-width: 640px) 45vw, (max-width: 1024px) 31vw, 410px"
		/>
	));
	return (
		<div className={cn(framed && "frame", "mt-24 lg:mt-32", className)}>
			<SectionIntro title={title} text={text} />
			<ProductRail items={items} label={title} />
		</div>
	);
}

/**
 * "Todays Trending Plants": one story photograph across two columns and two rows, the product
 * tiles filling the cells around it.
 */
export function FeatureGrid({
	title,
	text,
	story,
	products,
}: {
	title: string;
	text?: string | null;
	story: { image?: string; title: string; href: string };
	products: CardProduct[];
}) {
	return (
		<div className="frame mt-24 lg:mt-32">
			<SectionIntro title={title} text={text} />
			<div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
				<Link
					href={story.href}
					className="group relative isolate flex min-h-[420px] items-end overflow-hidden bg-[#3a3532] sm:col-span-2 lg:row-span-2"
				>
					{story.image && (
						<YNSMedia
							src={story.image}
							alt=""
							fill
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 820px"
							className="-z-10 object-cover transition-transform duration-700 group-hover:scale-[1.02]"
						/>
					)}
					<span
						aria-hidden="true"
						className="absolute inset-0 -z-10 bg-linear-to-t from-black/60 to-black/0"
					/>
					<span className="p-6 text-[26px] leading-tight font-semibold text-white sm:p-10 sm:text-[28px]">
						{story.title}
					</span>
				</Link>
				{products.map((product) => (
					<ProductCard
						key={product.id}
						product={product}
						imageClassName="aspect-[11/12]"
						sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 410px"
					/>
				))}
			</div>
		</div>
	);
}
