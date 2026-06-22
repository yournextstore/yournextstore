import { ArrowUpRight } from "lucide-react";
import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

const fallback = [
	{ name: "Essentials", slug: "essentials" },
	{ name: "Outerwear", slug: "outerwear" },
	{ name: "Knitwear", slug: "knitwear" },
	{ name: "Accessories", slug: "accessories" },
	{ name: "New In", slug: "new-in" },
	{ name: "Sale", slug: "sale", highlight: true },
	{ name: "Archive", slug: "archive" },
];

export async function CategoryBar() {
	"use cache";
	cacheLife("hours");

	const res = await commerce.collectionBrowse({ limit: 7 });
	const items =
		res.data.length > 0
			? res.data.map((c, i) => ({ name: c.name, slug: c.slug, highlight: i === 5 }))
			: fallback;

	return (
		<section className="relative -mt-12 z-10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="rounded-[28px] bg-white shadow-[0_30px_80px_-40px_rgba(31,31,31,0.25)] ring-1 ring-black/5 px-3 sm:px-6 py-3">
					<div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
						{items.map((item) => (
							<YnsLink
								key={item.slug}
								prefetch={"eager"}
								href={`/collection/${item.slug}`}
								className={`group inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 sm:px-5 py-2.5 text-sm font-medium transition-all ${
									item.highlight ? "text-[--ember]" : "text-[--ink]/75 hover:text-[--ink] hover:bg-[--sun]/15"
								}`}
							>
								{item.name}
								{item.highlight && (
									<ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
								)}
							</YnsLink>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
