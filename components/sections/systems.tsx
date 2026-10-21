import Link from "next/link";
import { Kicker, SectionHead } from "@/components/rack/section-head";
import { formatFromPrice, getRackCatalog, pickTiers, stockTag } from "@/lib/rack";
import { cn } from "@/lib/utils";

const TIERS = [
	{ name: "First Patch", sub: "The way in. The smallest step into a rack of your own." },
	{
		name: "Weekender",
		sub: "The middle of the line — a little more signal, a little more room to patch.",
		flag: "most patched",
	},
	{ name: "The Wall", sub: "The top of the range. More than you need today. You'll use it." },
] as const;

/** Three "systems": the entry piece, a mid pick and the top of the range, priced from the catalogue. */
export async function Systems() {
	const { products, freeShipping } = await getRackCatalog();
	const picks = pickTiers(products);
	if (picks.length === 0) return null;
	const prices = await Promise.all(picks.map((p) => formatFromPrice(p.variants)));

	return (
		<section id="systems" className="section-x py-[clamp(4rem,9vw,7rem)]">
			<SectionHead
				kicker="Systems"
				title="Start small. It won't help."
				lead="Three ways in, from the first module to the whole wall. Fair warning: “enough” is not a real number."
			/>
			<div className="frame">
				<div className="grid max-w-[34rem] grid-cols-1 items-stretch gap-[1.1rem] lg:max-w-none lg:grid-cols-3">
					{picks.map((product, i) => {
						const tier = TIERS[i] ?? TIERS[0];
						const star = i === 1;
						const tag = stockTag(product.variants);
						return (
							<article
								key={product.id}
								className={cn(
									"panel-card lift flex flex-col px-[1.4rem] pt-[1.4rem] pb-[1.5rem]",
									star && "border-[color-mix(in_oklab,var(--rk-led-amber)_55%,var(--rk-line))]",
								)}
							>
								{"flag" in tier && (
									<p className="font-plate mb-[0.6rem] text-[0.66rem] tracking-[0.14em] text-signal uppercase">
										{tier.flag}
									</p>
								)}
								<h3 className="text-[1.35rem] text-ink">{tier.name}</h3>
								<p className="font-plate mt-[0.6rem] mb-[0.1rem] text-[1.6rem] text-ink">{prices[i]}</p>
								<p className="mb-4 text-[0.88rem] text-dim">{tier.sub}</p>
								<ul className="mb-[1.4rem] grid flex-1 content-start gap-[0.45rem]">
									{[
										product.name,
										product.summary ? firstClause(product.summary) : null,
										`Status: ${tag.label}`,
										freeShipping ? `Free shipping over ${freeShipping}` : "Shipping quoted at checkout",
									]
										.filter((line): line is string => Boolean(line))
										.map((line) => (
											<li key={line} className="relative pl-5 text-[0.86rem] text-dim">
												<span aria-hidden="true" className="absolute left-0 text-signal">
													→
												</span>
												{line}
											</li>
										))}
								</ul>
								<Link
									href={`/product/${product.slug}`}
									className={cn("btn w-full", star ? "btn-primary" : "btn-ghost")}
									aria-label={`Hold one: ${product.name}`}
								>
									Hold one
								</Link>
							</article>
						);
					})}
				</div>
				<p className="mt-[1.6rem] text-[0.8rem] text-faint">
					Every module is sold on its own too — systems just name the ways in. Taxes and delivery are worked
					out at checkout.
				</p>

				<div className="panel-card mt-[clamp(2.4rem,5vw,3.6rem)] grid items-center gap-[clamp(1.4rem,4vw,3rem)] rounded-[18px] p-[clamp(1.4rem,3vw,2.2rem)] shadow-[var(--rk-shadow)] md:grid-cols-2">
					<div>
						<Kicker>Find a module</Kicker>
						<h3 className="mt-4 text-[clamp(1.4rem,3vw,1.9rem)] text-ink">A short line, easy to search.</h3>
						<p className="mt-[0.7rem] max-w-[44ch] text-dim">
							Search the line by name or mood, or browse everything we have on the shelf today.
						</p>
					</div>
					<form action="/search" className="min-w-0">
						<label htmlFor="slot-q" className="plate-label mb-[0.4rem] block">
							Search the line
						</label>
						<input
							id="slot-q"
							name="q"
							type="search"
							placeholder="filter, LFO, reverb…"
							className="mb-4 w-full rounded-[10px] border border-line bg-page px-[0.85rem] py-[0.7rem] text-[0.92rem] text-ink placeholder:text-faint"
						/>
						<button type="submit" className="btn btn-primary w-full">
							Search
						</button>
						<p className="font-plate mt-[0.8rem] text-center text-[0.7rem] text-faint">
							or{" "}
							<Link href="/products" className="text-signal underline-offset-4 hover:underline">
								browse all modules →
							</Link>
						</p>
					</form>
				</div>
			</div>
		</section>
	);
}

function firstClause(text: string) {
	const clause = text.split(/[,.;]/)[0]?.trim() ?? "";
	return clause.split(" ").length >= 3 && clause.length < 70 ? clause : null;
}
