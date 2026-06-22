import { ChevronDown, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

async function getCount() {
	"use cache";
	cacheLife("minutes");
	const result = await commerce.productBrowse({ active: true, limit: 100 });
	return result.data.length;
}

export async function Hero() {
	const count = await getCount();
	const displayCount = count > 0 ? String(count).padStart(2, "0") : "139";

	return (
		<section className="bg-editorial-gradient relative overflow-hidden">
			<div aria-hidden className="bg-noise pointer-events-none absolute inset-0 opacity-60" />
			<div className="relative mx-auto max-w-[1440px] px-6 pt-10 pb-6 lg:px-12">
				<nav className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
					<YnsLink href="/" className="hover:text-foreground transition-colors">
						Home
					</YnsLink>
					<ChevronRight className="h-3 w-3" strokeWidth={1.5} />
					<YnsLink href="/products" className="hover:text-foreground transition-colors">
						Clothing
					</YnsLink>
					<ChevronRight className="h-3 w-3" strokeWidth={1.5} />
					<span className="text-foreground">New Season</span>
				</nav>

				<div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="text-[11px] uppercase tracking-[0.28em] text-lilac-deep">Resort 26 Edit</p>
						<h1 className="font-display mt-3 text-5xl font-medium leading-[0.95] tracking-[-0.02em] text-foreground sm:text-6xl lg:text-[5.5rem]">
							New Season{" "}
							<span className="italic font-normal text-lilac-deep">
								Arrivals
								<sup className="ml-2 align-super text-base font-sans font-medium not-italic tracking-normal text-muted-foreground">
									{displayCount}
								</sup>
							</span>
						</h1>
					</div>
					<p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
						A curated edit of designer pieces — from cropped tailoring and silk separates to investment
						knitwear, all selected by the YNS atelier.
					</p>
				</div>

				<div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-6">
					<div className="flex flex-wrap items-center gap-2">
						<button
							type="button"
							className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/70 px-4 py-2 text-xs uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-foreground hover:text-background"
						>
							<SlidersHorizontal className="h-3.5 w-3.5" />
							Filters
							<span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] text-background">
								3
							</span>
						</button>
						{["Tops", "Size M", "$50 – $250"].map((chip) => (
							<button
								key={chip}
								type="button"
								className="inline-flex items-center gap-1.5 rounded-full bg-lilac-soft px-4 py-2 text-xs uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-accent"
							>
								{chip}
								<X className="h-3 w-3" />
							</button>
						))}
					</div>
					<button
						type="button"
						className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/70 px-4 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
					>
						Sort by
						<ChevronDown className="h-3.5 w-3.5" />
					</button>
				</div>
			</div>
		</section>
	);
}
