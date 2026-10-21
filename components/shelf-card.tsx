"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { PriceShelf } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

const BADGE_TONE = { gold: "badge-gold", rust: "", muted: "badge-muted" } as const;

/**
 * One "On the Shelf" menu card: a Playfair brass heading that folds its list open and shut (the
 * original's accordion, open by default; the minus turns into a plus), then rows of name, badge,
 * a muted note and the price.
 */
export function ShelfCard({ shelf, index }: { shelf: PriceShelf; index: number }) {
	const [open, setOpen] = useState(true);
	const id = useId();
	const panelId = `${id}-panel`;
	const buttonId = `${id}-button`;

	return (
		<div className="overflow-hidden rounded-[4px] border border-gold/15 bg-page">
			<h3 className="m-0">
				<button
					type="button"
					id={buttonId}
					aria-expanded={open}
					aria-controls={panelId}
					onClick={() => setOpen((value) => !value)}
					className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors duration-150 hover:bg-gold/5 focus-visible:outline-offset-[-2px]"
				>
					<span className="serif text-[1.125rem] font-bold tracking-[0.05em] text-gold sm:text-[1.25rem]">
						{shelf.name}
					</span>
					<span aria-hidden="true" className="relative size-[18px] shrink-0">
						<span className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 bg-gold" />
						<span
							className={cn(
								"absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 bg-gold transition-transform duration-150",
								open ? "rotate-0" : "rotate-90",
							)}
						/>
					</span>
				</button>
			</h3>
			<section
				id={panelId}
				aria-labelledby={buttonId}
				hidden={!open}
				data-shelf={index}
				className="px-5 pb-5"
			>
				<ul>
					{shelf.items.map((item) => (
						<li key={item.id} className="flex gap-3 border-b border-line-2 py-3 last:border-b-0 last:pb-0">
							<Link
								href={item.href}
								tabIndex={-1}
								aria-hidden="true"
								className="relative size-14 shrink-0 overflow-hidden rounded-[3px] border border-gold/15 bg-panel"
							>
								{item.image && (
									<YNSMedia src={item.image} alt="" fill sizes="56px" className="object-cover" />
								)}
							</Link>
							<div className="min-w-0 flex-1">
								<div className="mb-1 flex items-start justify-between gap-3">
									<div className="flex min-w-0 flex-wrap items-center gap-2">
										<Link
											href={item.href}
											className="font-semibold text-cream transition-colors hover:text-gold"
										>
											{item.name}
										</Link>
										{item.badge && (
											<span className={cn("badge", BADGE_TONE[item.badge.tone])}>{item.badge.label}</span>
										)}
									</div>
									<span className="mono shrink-0 font-semibold text-gold">{item.price}</span>
								</div>
								{item.note && <p className="line-clamp-1 text-[0.875rem] text-dim">{item.note}</p>}
							</div>
						</li>
					))}
				</ul>
				<Link
					href={shelf.href}
					className="caps mt-4 inline-flex items-center gap-2 text-[0.75rem] text-gold transition-[gap,color] duration-150 hover:gap-3 hover:text-cream"
				>
					See the {shelf.name.toLowerCase()} <span aria-hidden="true">→</span>
				</Link>
			</section>
		</div>
	);
}
