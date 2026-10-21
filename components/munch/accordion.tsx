"use client";

import { type ReactNode, useId, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The original's spec accordion: serif titles over a tomato rule, each with the round plus that
 * turns into a minus. Headings are real h2s (Radix renders h3, which breaks heading order here).
 */
export function SpecAccordion({ items }: { items: { id: string; title: string; content: ReactNode }[] }) {
	const [open, setOpen] = useState<string | null>(null);
	const baseId = useId();
	if (items.length === 0) return null;
	return (
		<div className="flex flex-col">
			{items.map((item) => {
				const isOpen = open === item.id;
				const panelId = `${baseId}-${item.id}`;
				return (
					<div key={item.id} className="border-b border-brand pt-lg pb-xs">
						<h2>
							<button
								type="button"
								aria-expanded={isOpen}
								aria-controls={panelId}
								onClick={() => setOpen(isOpen ? null : item.id)}
								className="group mb-s flex w-full items-start justify-between gap-s text-left"
							>
								<span className="font-serif text-d-base leading-[1.2] tracking-[-0.64px] text-brand lg:text-d-lg">
									{item.title}
								</span>
								<span className="relative size-8 shrink-0 rounded-full border-[1.5px] border-brand transition-colors duration-300 group-hover:bg-brand">
									<span className="absolute top-1/2 left-1/2 h-[1.5px] w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand transition-colors group-hover:bg-paper" />
									<span
										className={cn(
											"absolute top-1/2 left-1/2 h-3 w-[1.5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand transition-all duration-300 group-hover:bg-paper",
											isOpen && "rotate-90",
										)}
									/>
								</span>
							</button>
						</h2>
						<div
							id={panelId}
							hidden={!isOpen}
							className="pb-s text-b-md leading-[1.5] font-normal lg:text-b-lg"
						>
							{item.content}
						</div>
					</div>
				);
			})}
		</div>
	);
}
