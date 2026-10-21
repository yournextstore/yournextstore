import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { type CardProduct, ProductCard } from "@/components/product-card";

export type IndexLink = { href: string; label: string; current?: boolean };

/**
 * A listing page's title block in the original's voice: an italic serif label with a colon,
 * then a comma-separated index of where else to go, set in the large sans.
 */
export function ListingHeader({
	title,
	description,
	links = [],
	children,
}: {
	title: string;
	description?: string | null;
	links?: IndexLink[];
	children?: ReactNode;
}) {
	return (
		<div className="pt-6 pb-4 md:pt-12 md:pb-8 lg:pt-16">
			<h1 className="font-serif text-3xl italic md:text-5xl">{title}:</h1>
			{description && <p className="max-w-2xl pt-3 md:text-lg md:leading-relaxed">{description}</p>}
			{links.length > 0 && (
				<p className="pt-3 text-lg md:text-xl lg:text-2xl">
					{links.map((link, index) => (
						<Fragment key={link.href}>
							{index ? ", " : ""}
							<Link
								href={link.href}
								aria-current={link.current ? "page" : undefined}
								className={link.current ? "italic underline underline-offset-4" : "hover:italic"}
							>
								{link.label}
							</Link>
						</Fragment>
					))}
				</p>
			)}
			{children}
		</div>
	);
}

/** Four-up grid of the original's tall tiles. */
export function ListingGrid({ products }: { products: CardProduct[] }) {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8 xl:grid-cols-4">
			{products.map((product, index) => (
				<ProductCard
					key={product.id}
					product={product}
					priority={index === 0}
					imageClassName="aspect-[4/5] sm:aspect-[9/14]"
				/>
			))}
		</div>
	);
}

export function ListingEmpty({ children }: { children: ReactNode }) {
	return <p className="py-24 font-serif text-2xl italic">{children}</p>;
}
