import type { Metadata } from "next";
import { HeroShowcase, type ShowcasePiece } from "@/components/home/hero-showcase";
import { SectionRow } from "@/components/home/section-row";
import { ProductCard, variantLabel, variantPriceText } from "@/components/product-card";
import {
	getHeroPieces,
	getShopSections,
	getStoreIdentity,
	sectionRowSize,
	sentenceCase,
} from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default async function Home() {
	const [pieces, sections, config, identity] = await Promise.all([
		getHeroPieces(),
		getShopSections(),
		getStoreConfig(),
		getStoreIdentity(),
	]);

	if (pieces.length === 0) {
		return (
			<div className="flex min-h-[50vh] flex-col items-start justify-center gap-3">
				<h1 className="font-display text-6xl leading-[0.9]">No products yet</h1>
				<p className="text-muted-foreground">Check back soon for the first pieces.</p>
			</div>
		);
	}

	const showcase: ShowcasePiece[] = pieces.map((piece) => {
		const { product } = piece;
		const { min } = priceRange(product.variants, config.taxBehavior);
		const optionType = product.variants[0]?.combinations[0]?.variantValue.variantType.label;
		return {
			product: { id: product.id, name: product.name, slug: product.slug, images: product.images },
			href: `/product/${product.slug}`,
			image: piece.image,
			word: piece.word,
			wordSize: piece.wordSize,
			categoryLabel: piece.categoryLabel,
			priceText: formatMoney({ amount: min, currency: config.currency, locale: config.locale }),
			optionLabel: optionType ? sentenceCase(optionType) : null,
			variants: product.variants.map((variant) => ({
				id: variant.id,
				sku: variant.sku,
				price: variant.price,
				priceGross: variant.priceGross,
				images: variant.images,
				label: variantLabel(variant),
				priceText: variantPriceText(variant, config),
				available: variant.stock !== 0,
			})),
		};
	});

	const rails = pieces.map((piece) =>
		piece.pairs.length > 0 ? (
			<div
				key={piece.product.id}
				className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-2.5 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:px-0"
			>
				{piece.pairs.map((pair) => (
					<div key={pair.id} className="w-[70%] shrink-0 snap-start sm:w-[42%] lg:w-auto">
						<ProductCard product={pair} meta={null} />
					</div>
				))}
			</div>
		) : null,
	);

	const rowSize = sectionRowSize(sections);
	const bands = (
		<nav aria-label="Browse sections" className="-mx-4 flex flex-col border-t border-line lg:-mx-8">
			{sections.map((section) => (
				<SectionRow
					key={section.slug}
					href={section.href}
					label={section.name}
					count={section.count}
					size={rowSize}
				/>
			))}
		</nav>
	);

	return (
		<>
			<h1 className="sr-only">{identity.storeName} — new pieces this season</h1>
			<HeroShowcase pieces={showcase} sections={sections} bands={bands} rails={rails} />
		</>
	);
}
