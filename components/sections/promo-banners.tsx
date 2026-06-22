import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

type Promo = {
	title: string;
	subtitle: string;
	off: string;
	tint: string;
	image: string;
	imageAlt: string;
};

const PROMOS: Promo[] = [
	{
		title: "Maternal Health Comfort",
		subtitle: "Prenatal vitamins & wellness",
		off: "10% Off",
		tint: "bg-peach-gradient",
		image: "/scraped-3.jpg",
		imageAlt: "Maternal health",
	},
	{
		title: "Headache & Migraine Solutions",
		subtitle: "Fast-acting relief",
		off: "10% Off",
		tint: "bg-butter-gradient",
		image: "/scraped-1.jpg",
		imageAlt: "Headache and migraine",
	},
	{
		title: "Cold Relief",
		subtitle: "Sniffles & sore throats, sorted",
		off: "15% Off",
		tint: "bg-sky-gradient",
		image: "/scraped-5.jpg",
		imageAlt: "Cold relief",
	},
	{
		title: "Diabetes Essentials",
		subtitle: "Monitors, strips & care",
		off: "12% Off",
		tint: "bg-mint-gradient",
		image: "/scraped-2.jpg",
		imageAlt: "Diabetes care",
	},
];

export function PromoBanners() {
	return (
		<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div className="mb-6 flex items-end justify-between gap-4">
				<h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
					Featured wellness picks
				</h2>
				<YnsLink
					href="/products"
					className="hidden text-xs font-semibold uppercase tracking-wide text-[color:var(--mint-deep)] underline-offset-4 hover:underline sm:inline"
				>
					Browse all
				</YnsLink>
			</div>
			<div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
				{PROMOS.map((promo) => (
					<YnsLink
						key={promo.title}
						href="/products"
						className={`${promo.tint} group relative flex h-[200px] w-[300px] shrink-0 flex-col justify-between overflow-hidden rounded-3xl p-5 ring-1 ring-foreground/5 transition-transform hover:-translate-y-0.5 sm:h-[220px] sm:w-[340px]`}
					>
						<div className="relative z-10 max-w-[60%]">
							<h3 className="font-display text-lg font-bold leading-tight text-[color:var(--mint-deep)]">
								{promo.title}
							</h3>
							<p className="mt-1 text-xs text-[color:var(--mint-deep)]/70">{promo.subtitle}</p>
							<span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[color:var(--mint-deep)] underline-offset-4 group-hover:underline">
								Browse all
								<ArrowRightIcon className="h-3 w-3" />
							</span>
						</div>
						<span className="relative z-10 inline-flex w-fit items-center rounded-full bg-white px-3 py-1 text-xs font-bold text-[color:var(--mint-deep)] shadow-sm">
							Flat {promo.off}
						</span>
						<div className="pointer-events-none absolute -right-4 -top-2 bottom-0 w-[55%] overflow-hidden rounded-3xl">
							<Image
								src={promo.image}
								alt={promo.imageAlt}
								fill
								sizes="200px"
								className="object-cover object-center"
							/>
							<div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/0" />
						</div>
					</YnsLink>
				))}
			</div>
		</section>
	);
}
