import Image from "next/image";
import { YnsLink } from "@/components/yns-link";

const lookbookItems = [
	{
		image: "/scraped-7.png",
		label: "Basic care",
		className: "col-span-2 row-span-2",
	},
	{
		image: "/scraped-8.png",
		label: "Brighten",
		className: "col-span-1 row-span-1",
	},
	{
		image: "/scraped-9.png",
		label: "Moisturizer",
		className: "col-span-1 row-span-1",
	},
];

export function Lookbook() {
	return (
		<section className="py-16 sm:py-20">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<h3 className="mb-8 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
					Backed by Science, Perfected for You
				</h3>
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
					{lookbookItems.map((item) => (
						<YnsLink
							prefetch={"eager"}
							key={item.label}
							href="/products"
							className={`group relative overflow-hidden rounded-sm ${item.className}`}
						>
							<div className="relative aspect-square w-full sm:aspect-auto sm:h-full sm:min-h-[280px]">
								<Image
									src={item.image}
									alt={item.label}
									fill
									sizes="(max-width: 640px) 50vw, 33vw"
									className="object-cover transition-transform duration-500 group-hover:scale-105"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
								<div className="absolute inset-x-0 bottom-0 p-4">
									<span className="text-sm font-semibold uppercase tracking-wider text-white">
										{item.label}
									</span>
								</div>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
