import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

const FALLBACK_TILES = [
	{ label: "Outerwear", code: "01", tile: "skylrk-tile-1" },
	{ label: "Bottoms", code: "02", tile: "skylrk-tile-2" },
	{ label: "Accessories", code: "03", tile: "skylrk-tile-3" },
	{ label: "Tech", code: "04", tile: "skylrk-tile-4" },
];

export async function CategoryTiles() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 4 });
	const data = collections.data;

	const tiles =
		data.length >= 4
			? data.slice(0, 4).map((c, i) => ({
					label: c.name,
					href: `/collection/${c.slug}`,
					code: `0${i + 1}`,
					tile: FALLBACK_TILES[i]?.tile ?? "skylrk-tile-1",
				}))
			: FALLBACK_TILES.map((t, i) => ({
					label: data[i]?.name ?? t.label,
					href: data[i] ? `/collection/${data[i]?.slug}` : "/products",
					code: t.code,
					tile: t.tile,
				}));

	return (
		<section className="relative bg-background py-20 sm:py-24 overflow-hidden">
			<div className="max-w-[1400px] mx-auto px-6">
				<div className="flex items-end justify-between mb-10">
					<div>
						<p className="font-mono text-[10px] uppercase tracking-[0.32em] text-cyan-300/70 mb-3">
							[ 003 — categories ]
						</p>
						<h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight">
							Browse the archive
						</h2>
					</div>
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
					{tiles.map((t) => (
						<YnsLink
							prefetch={"eager"}
							key={t.label}
							href={t.href}
							className={`group relative aspect-[4/5] rounded-2xl overflow-hidden border border-border ${t.tile}`}
						>
							<div
								aria-hidden="true"
								className="absolute inset-0 opacity-60 group-hover:opacity-90 transition-opacity"
								style={{
									background: "radial-gradient(circle at 50% 80%, rgba(6,26,38,0.6), transparent 70%)",
								}}
							/>
							<div className="absolute inset-0 p-5 flex flex-col justify-between">
								<span className="font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/60">
									[ {t.code} ]
								</span>
								<div>
									<h3 className="font-display text-xl sm:text-2xl font-medium tracking-tight text-foreground">
										{t.label}
									</h3>
									<span className="mt-2 inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.24em] text-foreground/70 group-hover:text-cyan-200 transition-colors">
										[ shop → ]
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
