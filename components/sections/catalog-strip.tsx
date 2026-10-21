import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import type { CatalogEntry } from "@/lib/catalog";
import { YNSMedia } from "@/lib/yns-media";

/** The template's category row under the slideshow: picture, name, and a muted "from $X" line. */
export function CatalogStrip({ entries }: { entries: CatalogEntry[] }) {
	if (entries.length === 0) return null;
	return (
		<section aria-label="Catalog" className="uk-section bg-card">
			<div className="uk-container">
				<ul className="flex flex-wrap justify-center gap-y-10">
					{entries.slice(0, 6).map((entry) => (
						<li key={entry.href} className="w-1/2 px-[10px] sm:w-1/3 lg:w-1/6 lg:px-5">
							<Link href={entry.href} className="group block text-center">
								<span className="relative mb-[15px] block aspect-[4/3] overflow-hidden rounded-[4px] bg-muted">
									{entry.image && (
										<YNSMedia
											src={entry.image}
											alt=""
											fill
											sizes="(max-width: 640px) 50vw, 200px"
											className="object-cover transition-transform duration-500 group-hover:scale-105"
										/>
									)}
								</span>
								<span className="block text-muted-foreground transition-colors group-hover:text-foreground">
									{entry.name}
								</span>
								{entry.note && (
									<span className="mt-[2px] block line-clamp-1 text-uk-xs text-muted-foreground">
										{entry.note}
									</span>
								)}
							</Link>
						</li>
					))}
				</ul>
				<p className="mt-10 text-center">
					<Link href="/products" className="uk-link-all">
						See the full catalog
						<ChevronRightIcon aria-hidden className="size-3" strokeWidth={1.5} />
					</Link>
				</p>
			</div>
		</section>
	);
}
