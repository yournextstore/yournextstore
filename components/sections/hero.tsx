import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { displayPrice, type TaxBehavior } from "@/lib/pricing";

type HeroProps = {
	storeName: string;
	stats: {
		productCount: number;
		categoryCount: number;
		collectionCount: number;
		cheapest: { price: string; priceGross?: string | null } | null;
	};
	money: { currency: string; locale: string; taxBehavior: TaxBehavior };
};

export function Hero({ storeName, stats, money }: HeroProps) {
	const from = stats.cheapest
		? formatMoney({
				amount: BigInt(displayPrice(stats.cheapest, money.taxBehavior)),
				currency: money.currency,
				locale: money.locale,
			})
		: null;
	const statItems = [
		{ label: "Products", value: stats.productCount },
		{ label: "Categories", value: stats.categoryCount },
		{ label: "Collections", value: stats.collectionCount },
	].filter((item) => item.value > 0);

	return (
		<section className="shop-container pt-16 pb-12 md:pt-24 md:pb-20">
			<div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-[1fr_auto] lg:gap-20">
				<div className="min-w-0">
					<p className="anim-fade-up mb-6 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
						{storeName} — New Collection
					</p>
					<h1 className="anim-fade-up anim-delay-1 font-display leading-[0.88] tracking-tight text-foreground">
						<span className="block text-[clamp(3.5rem,9vw,8.5rem)] font-medium">Discover</span>
						<span className="-mt-1 block text-[clamp(3.5rem,9vw,8.5rem)] font-extrabold">the Finest</span>
						<span className="-mt-1 block text-[clamp(3.5rem,9vw,8.5rem)] font-medium text-brand-display">
							Products.
						</span>
					</h1>
					<div className="anim-fade-up anim-delay-2 mt-10 flex flex-wrap items-center gap-6">
						<Link
							href="/products"
							className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-colors duration-300 hover:bg-brand hover:text-brand-foreground"
						>
							Explore Collection
							<span aria-hidden className="text-base">
								→
							</span>
						</Link>
						{stats.productCount > 0 && (
							<span className="font-price text-xs tracking-[-0.02em] text-muted-foreground">
								{stats.productCount} products{from ? ` from ${from}` : ""}
							</span>
						)}
					</div>
				</div>

				{statItems.length > 0 && (
					<dl className="anim-fade-up anim-delay-3 hidden flex-col items-end gap-8 pb-2 lg:flex">
						{statItems.map(({ label, value }) => (
							<div key={label} className="flex flex-col-reverse text-right">
								<dt className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
									{label}
								</dt>
								<dd className="font-price text-3xl font-bold text-foreground">{value}</dd>
							</div>
						))}
					</dl>
				)}
			</div>
		</section>
	);
}
