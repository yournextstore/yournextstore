import { ArrowRight } from "lucide-react";
import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

const fallbackEmojis = ["🥬", "🍞", "🍎", "🥚", "🥛", "🥕", "🧀", "🐟", "🍇", "🥑"];

export async function CategoryPills() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 10 });
	const items = collections.data;

	if (items.length === 0) {
		return null;
	}

	return (
		<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div className="rounded-3xl bg-white p-4 shadow-card sm:p-6">
				<div className="scrollbar-none flex gap-3 overflow-x-auto pb-2">
					{items.slice(0, 8).map((collection, i) => {
						const productCount =
							"productCount" in collection && typeof collection.productCount === "number"
								? collection.productCount
								: undefined;
						return (
							<YnsLink
								key={collection.id}
								prefetch={"eager"}
								href={`/collection/${collection.slug}`}
								className="group flex min-w-[170px] flex-1 items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--secondary)]/60 px-4 py-3 transition hover:border-[var(--brand)]/30 hover:bg-[var(--brand-soft)]"
							>
								<span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-xl shadow-soft ring-1 ring-[var(--border)]">
									<span aria-hidden="true">{fallbackEmojis[i % fallbackEmojis.length]}</span>
								</span>
								<div className="min-w-0">
									<div className="truncate font-display text-sm font-semibold text-[var(--brand-deep)]">
										{collection.name}
									</div>
									<div className="text-[11px] text-[var(--muted-foreground)]">
										{productCount !== undefined ? `${productCount} items` : "Fresh today"}
									</div>
								</div>
							</YnsLink>
						);
					})}
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="group flex min-w-[140px] items-center gap-3 rounded-2xl bg-[var(--brand-soft)] px-4 py-3 text-[var(--brand-deep)] transition hover:bg-[var(--brand)] hover:text-white"
					>
						<span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white shadow-soft">
							<ArrowRight className="h-5 w-5 text-[var(--brand-deep)] transition group-hover:translate-x-0.5" />
						</span>
						<div>
							<div className="font-display text-sm font-semibold">See all</div>
							<div className="text-[11px] opacity-70">Browse aisles</div>
						</div>
					</YnsLink>
				</div>
			</div>
		</section>
	);
}
