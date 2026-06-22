import Image from "next/image";
import { previewHref } from "@/lib/demo-products";
import { YnsLink } from "../yns-link";

const COLLECTIONS = [
	{
		label: "Candles",
		title: "Travertine Light",
		image: "/scraped-0.jpg",
		href: "/products",
	},
	{
		label: "Diffusers",
		title: "Botanical Study",
		image: "/scraped-4.jpg",
		href: "/products",
	},
	{
		label: "Rituals",
		title: "Alabaster Bath",
		image: "/scraped-5.jpg",
		href: "/products",
	},
];

export function CollectionRow({ preview = false }: { preview?: boolean }) {
	return (
		<section className="bg-[#f4efe6]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="flex items-end justify-between mb-12">
					<div>
						<p className="text-[11px] tracking-luxe uppercase text-[#8b6b4a] mb-3">By Fragrance Family</p>
						<h2 className="font-serif text-3xl sm:text-4xl text-foreground">A library of three accords</h2>
					</div>
					<YnsLink
						prefetch="eager"
						href={previewHref("/products", preview)}
						className="hidden sm:inline-block text-[11px] tracking-luxe uppercase text-foreground border-b border-[#c9a87c] pb-1"
					>
						See all
					</YnsLink>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
					{COLLECTIONS.map((c) => (
						<YnsLink key={c.title} prefetch="eager" href={previewHref(c.href, preview)} className="group">
							<div className="relative aspect-[3/4] overflow-hidden bg-[#e8dcc8] rounded-sm">
								<Image
									src={c.image}
									alt={c.title}
									fill
									sizes="(max-width: 640px) 100vw, 33vw"
									className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-[#1a1410]/40 via-transparent to-transparent" />
								<div className="absolute bottom-0 left-0 p-6 text-[#f4efe6]">
									<p className="text-[10px] tracking-luxe uppercase text-[#e8dcc8] mb-2">{c.label}</p>
									<h3 className="font-serif text-2xl">{c.title}</h3>
								</div>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
