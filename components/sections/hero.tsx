import type { APIProductsBrowseResult } from "commerce-kit";
import Link from "next/link";
import { FinishSwitch } from "@/components/finish-switch";
import { splitTitle } from "@/lib/catalog";
import { YNSMedia } from "@/lib/yns-media";

type Product = APIProductsBrowseResult["data"][number];

/**
 * The original's launch stage. Its react-three-fiber headphone is replaced by the featured
 * product's photograph lit as a pool of light on the same warm key: the effect, without a 7 MB
 * model and a WebGL context in front of first paint.
 */
export function Hero({
	featured,
	price,
	facts,
}: {
	featured: Product | null;
	price: string | null;
	facts: string[];
}) {
	const [lead, gilt] = splitTitle(featured?.name ?? "New season");
	const image = featured?.images[0];

	return (
		<section data-hero id="hero" className="relative isolate w-full overflow-hidden md:min-h-[100svh]">
			<div aria-hidden="true" className="stage-backdrop pointer-events-none absolute inset-0" />
			<div aria-hidden="true" className="noise pointer-events-none absolute inset-0" />

			<div className="container-stage relative z-10 flex flex-col pb-16 pt-[6.25rem] md:min-h-[100svh] md:pb-10 md:pt-28">
				<div className="grid flex-1 grid-cols-1 md:grid-cols-[minmax(0,40fr)_minmax(0,60fr)] md:grid-rows-[1fr_auto_auto_1fr] md:gap-x-6 lg:gap-x-10 xl:gap-x-12">
					<div className="animate-rise md:col-start-1 md:row-start-2 md:pr-2 lg:pr-6">
						<p className="text-kicker font-medium uppercase tracking-[0.42em] text-warm">
							Featured · Wireless · Over-ear
						</p>
						<h1 className="mt-5 text-balance break-words font-display text-[clamp(2.6rem,11vw,4rem)] font-light leading-[0.92] tracking-[-0.03em] text-ink md:text-hero">
							{lead && <span>{lead} </span>}
							<span className="title-gilt">{gilt}</span>
						</h1>
						{featured?.summary && (
							<p className="mt-6 max-w-md text-[15px] leading-[1.75] text-ink-soft md:mt-8 md:text-lg md:leading-relaxed">
								{featured.summary}
							</p>
						)}
						<FinishSwitch className="mt-9" />
					</div>

					<div className="relative mt-10 md:col-start-2 md:row-span-4 md:row-start-1 md:mt-0 md:self-center lg:translate-x-8 xl:translate-x-12">
						<div className="relative mx-auto aspect-square w-full max-w-[min(640px,62svh)] rounded-sm border border-hairline-strong bg-[rgba(0,0,0,0.04)] md:border-0 md:bg-transparent">
							<div
								aria-hidden="true"
								className="animate-breathe absolute inset-[4%] rounded-full blur-3xl [background:var(--key-light)]"
							/>
							{image && featured && (
								<YNSMedia
									src={image}
									alt={featured.name}
									fill
									priority
									sizes="(max-width: 768px) 92vw, 56vw"
									className="spotlight object-cover"
								/>
							)}
						</div>
					</div>

					<div className="animate-rise mt-10 flex flex-wrap gap-3 [animation-delay:120ms] sm:gap-4 md:col-start-1 md:row-start-3 md:mt-10">
						{featured ? (
							<Link href={`/product/${featured.slug}`} className="btn-premium btn-md">
								Buy now
							</Link>
						) : null}
						<Link href="/products" className="btn-ghost-line btn-md">
							Explore the shop
						</Link>
					</div>
				</div>

				<div className="mt-14 flex flex-col gap-8 border-t border-hairline pt-8 md:mt-6 md:flex-row md:items-center md:justify-between md:pt-10">
					<div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[12px] text-muted-foreground">
						{price && <span className="font-medium tracking-wide text-ink-soft">{price}</span>}
						{facts.map((fact) => (
							<span key={fact} className="flex items-center gap-8">
								<span aria-hidden="true" className="hidden h-3 w-px bg-hairline-strong sm:block" />
								{fact}
							</span>
						))}
					</div>
				</div>
			</div>

			<div
				aria-hidden="true"
				className="pointer-events-none absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 xl:flex"
			>
				<span className="text-micro font-medium uppercase tracking-[0.35em] text-muted-foreground">
					Scroll
				</span>
				<div className="flex h-12 w-px overflow-hidden bg-gradient-to-b from-[var(--scroll-line)] to-transparent">
					<div className="animate-cue h-4 w-full bg-[var(--scroll-dot)]" />
				</div>
			</div>
		</section>
	);
}
