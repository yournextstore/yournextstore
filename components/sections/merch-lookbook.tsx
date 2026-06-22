import Image from "next/image";
import { YnsLink } from "../yns-link";

const tiles = [
	{
		title: "Slogan Tee",
		eyebrow: "Wear it loud",
		src: "/scraped-1.jpg",
		bg: "bg-[#f2b7c1]",
	},
	{
		title: "Trucker Cap",
		eyebrow: "Stay hot",
		src: "/scraped-2.jpg",
		bg: "bg-[#e11226] text-[#fbf6ec]",
	},
	{
		title: "Sunset Tote",
		eyebrow: "Carry the vibe",
		src: "/scraped-3.jpg",
		bg: "bg-[#0f0f10] text-[#fbf6ec]",
	},
];

export function MerchLookbook() {
	return (
		<section className="bg-[#fbf6ec]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
					<div>
						<p className="text-[11px] tracking-[0.4em] uppercase text-[#e11226] font-semibold">Lookbook</p>
						<h2 className="mt-3 font-serif text-4xl sm:text-5xl lg:text-6xl text-[#0f0f10] tracking-tight leading-[1.04]">
							The <span className="italic text-[#e11226]">merch</span> drop.
						</h2>
					</div>
					<YnsLink
						href="/products"
						className="self-start sm:self-end text-[11px] tracking-[0.3em] uppercase font-semibold text-[#0f0f10] border-b border-[#0f0f10] pb-1 hover:text-[#e11226] hover:border-[#e11226] transition-colors"
					>
						Shop the lookbook →
					</YnsLink>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
					{tiles.map((tile, idx) => (
						<div
							key={tile.title}
							className={`group relative overflow-hidden rounded-sm ${tile.bg} ${
								idx === 1 ? "sm:translate-y-8" : ""
							}`}
						>
							<div className="relative aspect-[3/4]">
								<Image
									src={tile.src}
									alt={tile.title}
									fill
									sizes="(max-width: 640px) 100vw, 33vw"
									className="object-cover mix-blend-multiply opacity-90 transition-transform duration-700 group-hover:scale-105"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-current/30 via-transparent to-transparent" />
							</div>
							<div className="absolute bottom-0 inset-x-0 p-5 sm:p-7">
								<p className="text-[10px] tracking-[0.36em] uppercase opacity-80">{tile.eyebrow}</p>
								<h3 className="mt-1 font-serif text-2xl sm:text-3xl italic">{tile.title}</h3>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
