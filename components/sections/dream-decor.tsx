import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

const categories = [
	{
		title: "Sculptural Lighting",
		count: "32 pieces",
		image: "/scraped-0.jpg",
		href: "/products?category=lighting",
		tag: "Editor's pick",
	},
	{
		title: "Soft Textiles",
		count: "48 pieces",
		image: "/scraped-2.jpg",
		href: "/products?category=textiles",
		tag: "Just landed",
	},
	{
		title: "Stoneware & Ceramics",
		count: "26 pieces",
		image: "/scraped-3.jpg",
		href: "/products?category=ceramics",
		tag: "Small batch",
	},
];

export function DreamDecor() {
	return (
		<section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-20 sm:pt-28">
			<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
				<div>
					<p className="text-xs tracking-[0.22em] uppercase text-muted-foreground mb-3">— The edit</p>
					<h2 className="yns-display text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[1.02]">
						Dream Decor
					</h2>
				</div>
				<p className="max-w-md text-muted-foreground text-base leading-relaxed">
					A trio of categories shaping the season — each piece sourced for warmth, texture and a touch of
					quiet drama.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
				{categories.map((cat) => (
					<YnsLink
						key={cat.title}
						href={cat.href}
						className="group relative overflow-hidden rounded-3xl bg-secondary aspect-[4/5]"
					>
						<Image
							src={cat.image}
							alt={cat.title}
							fill
							sizes="(max-width: 768px) 100vw, 33vw"
							className="object-cover transition-transform duration-700 group-hover:scale-105"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-[#2b1e18]/70 via-[#2b1e18]/10 to-transparent" />
						<div className="absolute top-4 left-4">
							<span className="inline-flex items-center gap-1.5 rounded-full bg-background/85 backdrop-blur-md px-3 py-1 text-[11px] tracking-[0.16em] uppercase text-foreground">
								<span className="h-1.5 w-1.5 rounded-full bg-yns-sun" />
								{cat.tag}
							</span>
						</div>
						<div className="absolute top-4 right-4">
							<span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background text-foreground transition-transform group-hover:rotate-45">
								<ArrowUpRightIcon className="h-4 w-4" />
							</span>
						</div>
						<div className="absolute inset-x-0 bottom-0 p-5">
							<h3 className="yns-display text-2xl text-background">{cat.title}</h3>
							<p className="text-background/70 text-sm mt-0.5">{cat.count}</p>
						</div>
					</YnsLink>
				))}
			</div>
		</section>
	);
}
