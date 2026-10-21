import Image from "next/image";

/**
 * Editorial split hero: oat copy panel on the left (46%), the still-life photograph on the right;
 * on phones the photograph sits above the copy.
 */
export function Hero({ storeName }: { storeName: string }) {
	return (
		<section className="mx-auto grid w-full max-w-[1280px] bg-muted lg:min-h-[530px] lg:grid-cols-[46%_54%]">
			<div className="relative h-[280px] overflow-hidden sm:h-[360px] lg:col-start-2 lg:row-start-1 lg:h-auto">
				<Image
					src="/images/pexels/hero-straw-hat.jpg"
					alt="Croissants on cream linen on a pale wood bakery counter in morning light"
					fill
					priority
					sizes="(min-width: 1280px) 692px, (min-width: 1024px) 54vw, 100vw"
					className="object-cover object-[30%_50%]"
				/>
			</div>
			<div className="flex flex-col items-start justify-center p-7 sm:p-10 lg:col-start-1 lg:row-start-1 lg:p-[clamp(28px,4vw,64px)]">
				<p className="mb-7 text-[11px] uppercase tracking-[0.18em] text-eyebrow">
					{storeName} · Baked this morning
				</p>
				<h1 className="font-display text-[clamp(38px,4.6vw,68px)] font-normal leading-[1.04] tracking-[-0.045em] text-foreground">
					Good bread.
					<br />
					Slow mornings.
				</h1>
				<p className="mt-6 max-w-[32ch] text-body-md leading-[1.65] text-muted-foreground">
					Sourdough, laminated pastries and simple cakes, baked early every day from flour, butter and time.
				</p>
				<p className="mt-3 text-body-sm text-muted-foreground">Slow-fermented · Baked daily</p>
				<a
					href="#shop"
					className="mt-7 inline-flex h-[52px] min-w-[170px] items-center justify-center rounded-[4px] bg-primary px-7 text-body-md font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
				>
					Order from the bakery
				</a>
			</div>
		</section>
	);
}
