"use client";

import Image from "next/image";
import { useState } from "react";
import { YnsLink } from "../yns-link";

type Category = {
	label: string;
	href: string;
	image: string;
};

const WOMEN: Category[] = [
	{ label: "Leggings", href: "/products?gender=women&category=leggings", image: "/scraped-0.jpg" },
	{ label: "Tops", href: "/products?gender=women&category=tops", image: "/scraped-1.jpg" },
	{ label: "Sports Bras", href: "/products?gender=women&category=sports-bras", image: "/scraped-2.jpg" },
	{ label: "Dresses", href: "/products?gender=women&category=dresses", image: "/scraped-3.jpg" },
	{ label: "Outerwear", href: "/products?gender=women&category=outerwear", image: "/scraped-4.jpg" },
	{ label: "Shorts", href: "/products?gender=women&category=shorts", image: "/scraped-5.jpg" },
];

const MEN: Category[] = [
	{ label: "Shorts", href: "/products?gender=men&category=shorts", image: "/scraped-1.jpg" },
	{ label: "Tees", href: "/products?gender=men&category=tees", image: "/scraped-2.jpg" },
	{ label: "Joggers", href: "/products?gender=men&category=joggers", image: "/scraped-3.jpg" },
	{ label: "Long Sleeves", href: "/products?gender=men&category=long-sleeves", image: "/scraped-0.jpg" },
	{ label: "Outerwear", href: "/products?gender=men&category=outerwear", image: "/scraped-4.jpg" },
	{ label: "Accessories", href: "/products?gender=men&category=accessories", image: "/scraped-5.jpg" },
];

export function PopularCategories() {
	const [tab, setTab] = useState<"women" | "men">("women");
	const items = tab === "women" ? WOMEN : MEN;

	return (
		<section className="bg-background py-14 sm:py-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col gap-6 mb-8">
					<h2 className="display-section text-3xl sm:text-4xl md:text-5xl text-foreground tracking-tight">
						Popular Categories
					</h2>
					<div className="flex items-center gap-6 text-sm">
						<button
							type="button"
							onClick={() => setTab("women")}
							className={`pb-1 font-medium transition-colors ${
								tab === "women"
									? "text-foreground border-b-2 border-foreground"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							Women
						</button>
						<button
							type="button"
							onClick={() => setTab("men")}
							className={`pb-1 font-medium transition-colors ${
								tab === "men"
									? "text-foreground border-b-2 border-foreground"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							Men
						</button>
					</div>
				</div>
			</div>

			<div className="relative">
				<div className="flex gap-3 overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8 snap-x snap-mandatory">
					{items.map((cat) => (
						<YnsLink
							prefetch={"eager"}
							key={cat.label}
							href={cat.href}
							className="group relative shrink-0 snap-start w-[240px] sm:w-[280px] md:w-[300px] lg:w-[320px] aspect-[3/4] overflow-hidden bg-secondary"
						>
							<Image
								src={cat.image}
								alt={cat.label}
								fill
								sizes="(max-width: 768px) 280px, 320px"
								className="object-cover transition-transform duration-700 group-hover:scale-105"
							/>
							<div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
							<div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between">
								<span className="text-white text-lg font-semibold tracking-tight">{cat.label}</span>
								<span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-[--ink] text-xs">
									→
								</span>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
