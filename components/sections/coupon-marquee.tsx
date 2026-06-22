import Image from "next/image";

const thumbs = ["/scraped-1.jpg", "/scraped-2.jpg", "/scraped-3.jpg", "/scraped-4.jpg", "/scraped-5.jpg"];

function MarqueeItem({ index }: { index: number }) {
	const img = thumbs[index % thumbs.length];
	return (
		<div className="flex items-center gap-6 px-4">
			<span className="font-display text-2xl sm:text-3xl tracking-tight text-foreground">
				GET 20% OFF · COUPON
			</span>
			<span className="font-display text-2xl sm:text-3xl tracking-tight text-tan">"YNS20"</span>
			<span className="inline-flex h-12 w-16 sm:h-14 sm:w-20 items-center justify-center rounded-full bg-secondary overflow-hidden shrink-0">
				<Image
					src={img}
					alt=""
					width={80}
					height={56}
					className="h-full w-full object-cover"
					aria-hidden="true"
				/>
			</span>
		</div>
	);
}

export function CouponMarquee() {
	const items = Array.from({ length: 8 });
	return (
		<section aria-label="Promotion" className="border-y border-border bg-background py-5 overflow-hidden">
			<div className="flex w-max yns-marquee">
				{items.map((_, i) => (
					<MarqueeItem key={`a-${i}`} index={i} />
				))}
				{items.map((_, i) => (
					<MarqueeItem key={`b-${i}`} index={i} />
				))}
			</div>
		</section>
	);
}
