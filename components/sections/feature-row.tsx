import Image from "next/image";
import { YnsLink } from "../yns-link";

const features = [
	{
		eyebrow: "01 — Essentials",
		title: "The bottle",
		caption: "Hand-finished glass, soft to the lip and the eye.",
		image: "/scraped-3.jpg",
		href: "/products",
	},
	{
		eyebrow: "02 — Soothe",
		title: "The teat",
		caption: "Medical-grade silicone shaped from a mother's instinct.",
		image: "/scraped-4.jpg",
		href: "/products",
	},
	{
		eyebrow: "03 — Rituals",
		title: "The accessories",
		caption: "Pieces that turn feeding into a quiet ritual.",
		image: "/scraped-5.jpg",
		href: "/products",
	},
];

export function FeatureRow() {
	return (
		<section className="bg-[var(--cream)]">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 lg:py-28">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
					{features.map((f, i) => (
						<YnsLink key={f.title} href={f.href} className="group block" prefetch={"eager"}>
							<div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-secondary">
								<Image
									src={f.image}
									alt={f.title}
									fill
									sizes="(max-width: 768px) 100vw, 33vw"
									className="object-cover transition-transform duration-700 group-hover:scale-105"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60" />
								<span className="absolute top-4 left-4 text-[10px] tracking-[0.3em] uppercase text-white/85">
									{f.eyebrow}
								</span>
							</div>
							<div className="mt-5 flex items-end justify-between gap-4">
								<div>
									<h3 className="font-display text-2xl lg:text-3xl text-foreground leading-tight">
										{f.title}
									</h3>
									<p className="mt-2 text-sm text-muted-foreground max-w-xs">{f.caption}</p>
								</div>
								<span className="text-[10px] tracking-[0.3em] uppercase text-foreground/60 group-hover:text-[var(--olive-dark)] transition-colors whitespace-nowrap">
									Shop {String(i + 1).padStart(2, "0")}
								</span>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
