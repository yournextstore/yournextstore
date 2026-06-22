import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

const tiles = [
	{
		title: "Custom builds",
		count: "32 rigs",
		image: "/scraped-0.jpg",
		href: "/products",
		span: "lg:col-span-2 lg:row-span-2",
	},
	{
		title: "Cooling",
		count: "48 SKUs",
		image: "/scraped-1.jpg",
		href: "/products",
		span: "",
	},
	{
		title: "Graphics cards",
		count: "21 SKUs",
		image: "/scraped-2.jpg",
		href: "/products",
		span: "",
	},
	{
		title: "Cases & chassis",
		count: "16 SKUs",
		image: "/scraped-3.jpg",
		href: "/products",
		span: "lg:col-span-2",
	},
];

export function Categories() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="flex items-end justify-between mb-10 sm:mb-14">
				<h2 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-foreground">
					/categories
				</h2>
				<YnsLink
					href="/products"
					prefetch={"eager"}
					className="ghost-pill inline-flex items-center gap-2 h-10 px-5 rounded-full text-sm font-medium text-foreground"
				>
					Browse all
					<ArrowUpRight className="h-4 w-4" />
				</YnsLink>
			</div>

			<div className="grid grid-cols-2 lg:grid-cols-4 lg:auto-rows-[200px] gap-4">
				{tiles.map((t) => (
					<YnsLink
						key={t.title}
						href={t.href}
						prefetch={"eager"}
						className={`tile-dark group relative overflow-hidden rounded-2xl ${t.span}`}
					>
						<Image
							src={t.image}
							alt={t.title}
							fill
							sizes="(max-width: 640px) 50vw, 25vw"
							className="object-cover opacity-60 transition-all duration-500 group-hover:opacity-90 group-hover:scale-105"
						/>
						<div
							className="absolute inset-0 pointer-events-none"
							style={{
								background:
									"linear-gradient(180deg, rgba(15,14,18,0.1) 0%, rgba(15,14,18,0.5) 60%, rgba(15,14,18,0.95) 100%)",
							}}
						/>
						<div className="relative h-full flex flex-col justify-between p-5">
							<div className="self-end opacity-0 group-hover:opacity-100 transition-opacity">
								<div
									className="h-9 w-9 rounded-full flex items-center justify-center"
									style={{
										background: "linear-gradient(135deg, #d946c4, #a855f7)",
										boxShadow: "0 0 18px rgba(217,70,196,0.5)",
									}}
								>
									<ArrowUpRight className="h-4 w-4 text-white" />
								</div>
							</div>
							<div>
								<p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{t.count}</p>
								<h3 className="font-display text-xl sm:text-2xl font-semibold text-foreground mt-1">
									{t.title}
								</h3>
							</div>
						</div>
					</YnsLink>
				))}
			</div>
		</section>
	);
}
