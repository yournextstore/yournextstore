import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

const looks = [
	{
		image: "/scraped-2.jpg",
		label: "The Linen Edit",
		caption: "Mediterranean afternoons",
		href: "/products",
	},
	{
		image: "/scraped-3.jpg",
		label: "Studio Series",
		caption: "Quiet luxury, every day",
		href: "/products",
	},
	{
		image: "/scraped-4.jpg",
		label: "Weekend Light",
		caption: "Golden-hour essentials",
		href: "/products",
	},
];

export function Lookbook() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28">
			<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
				{looks.map((look, i) => (
					<YnsLink
						key={look.label}
						prefetch={"eager"}
						href={look.href}
						className={`group relative block aspect-[3/4] overflow-hidden rounded-3xl bg-[--ink] ring-1 ring-black/5 ${
							i === 0 ? "lg:translate-y-6" : i === 2 ? "lg:translate-y-6" : ""
						}`}
					>
						<Image
							src={look.image}
							alt={look.label}
							fill
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							className="object-cover transition-transform duration-700 group-hover:scale-105"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
						<div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between">
							<div className="self-end inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/95 text-[--ink] opacity-0 -translate-y-2 transition-all group-hover:opacity-100 group-hover:translate-y-0">
								<ArrowUpRight className="h-4 w-4" />
							</div>
							<div className="text-white">
								<p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[--sun]">
									Lookbook · 0{i + 1}
								</p>
								<h3 className="mt-2 font-display text-xl sm:text-2xl font-semibold leading-tight">
									{look.label}
								</h3>
								<p className="mt-1 text-sm text-white/75">{look.caption}</p>
							</div>
						</div>
					</YnsLink>
				))}
			</div>
		</section>
	);
}
