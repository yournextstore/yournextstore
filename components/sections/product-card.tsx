import { Plus } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "@/components/yns-link";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";

type Product = {
	id: string;
	slug: string;
	name: string;
	summary?: string | null;
	images?: string[] | null;
	variants: {
		id: string;
		price: string;
		stock: number | null;
		images?: string[] | null;
	}[];
};

type ProductCardProps = {
	product: Product;
};

function getProductPrice(product: Product) {
	const prices = product.variants.map((v) => BigInt(v.price));
	const minPrice = prices.reduce((a, b) => (a < b ? a : b));
	const maxPrice = prices.reduce((a, b) => (a > b ? a : b));

	if (minPrice === maxPrice) {
		return formatMoney({ amount: minPrice.toString(), currency: CURRENCY, locale: LOCALE });
	}

	return `${formatMoney({ amount: minPrice.toString(), currency: CURRENCY, locale: LOCALE })} - ${formatMoney({ amount: maxPrice.toString(), currency: CURRENCY, locale: LOCALE })}`;
}

function getProductImage(product: Product) {
	const allImages = [...(product.images ?? []), ...product.variants.flatMap((v) => v.images ?? [])].filter(
		(img, index, self) => self.indexOf(img) === index,
	);

	return allImages[0] ?? "/placeholder.jpg";
}

// Large card for Curated Essentials section
export function ProductCardLarge({ product }: ProductCardProps) {
	const image = getProductImage(product);
	const price = getProductPrice(product);

	return (
		<YnsLink href={`/product/${product.slug}`} className="group cursor-pointer block">
			<div className="aspect-[4/5] bg-secondary mb-6 overflow-hidden relative">
				<Image
					src={image}
					alt={product.name}
					fill
					className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
					sizes="(max-width: 768px) 100vw, 33vw"
				/>
				<button
					type="button"
					className="absolute bottom-4 right-4 w-10 h-10 bg-background rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg hover:bg-primary hover:text-primary-foreground"
					aria-label="Add to cart"
				>
					<Plus className="w-4 h-4" />
				</button>
			</div>
			<div className="flex justify-between items-start">
				<div>
					<h3 className="font-display text-2xl mb-1 group-hover:text-primary transition-colors">
						{product.name}
					</h3>
					{product.summary && (
						<p className="text-xs text-muted-foreground uppercase tracking-wider">{product.summary}</p>
					)}
				</div>
				<span className="font-medium">{price}</span>
			</div>
		</YnsLink>
	);
}

// Medium card for Best Sellers section
export function ProductCardMedium({ product }: ProductCardProps) {
	const image = getProductImage(product);
	const price = getProductPrice(product);

	return (
		<YnsLink href={`/product/${product.slug}`} className="group cursor-pointer flex flex-col">
			<div className="aspect-[3/4] bg-secondary mb-5 overflow-hidden relative rounded-sm">
				<Image
					src={image}
					alt={product.name}
					fill
					className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
					sizes="(max-width: 768px) 50vw, 25vw"
				/>
			</div>
			<div className="text-center mt-auto">
				<h3 className="font-display text-xl mb-1 text-foreground group-hover:text-primary transition-colors">
					{product.name}
				</h3>
				<span className="text-sm font-medium text-muted-foreground">{price}</span>
			</div>
		</YnsLink>
	);
}

// Small card for New Arrivals section
export function ProductCardSmall({ product }: ProductCardProps) {
	const image = getProductImage(product);
	const price = getProductPrice(product);

	return (
		<YnsLink href={`/product/${product.slug}`} className="group cursor-pointer block">
			<div className="aspect-[4/5] bg-card mb-4 overflow-hidden relative shadow-sm">
				<Image
					src={image}
					alt={product.name}
					fill
					className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
					sizes="(max-width: 768px) 50vw, 25vw"
				/>
			</div>
			<h3 className="font-display text-lg text-foreground group-hover:text-primary transition-colors">
				{product.name}
			</h3>
			<span className="text-sm text-muted-foreground font-medium">{price}</span>
		</YnsLink>
	);
}
