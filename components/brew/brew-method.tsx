"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Odometer } from "./odometer";

export type ShelfTab = {
	key: string;
	label: string;
	code: string;
	href: string;
	image: { src: string; alt: string };
	spec: [string, string][];
	lines: { name: string; href: string; price: string | null }[];
};

/** The original's segmented tablist, one tab per shelf: the readout card rolls its numbers, the photo crossfades. */
export function BrewMethod({ shelves }: { shelves: ShelfTab[] }) {
	const [method, setMethod] = useState(shelves[0]?.key ?? "");
	const tabs = useRef<(HTMLButtonElement | null)[]>([]);
	const METHODS = shelves.map((shelf) => shelf.key);
	const index = Math.max(0, METHODS.indexOf(method));
	const d = shelves[index];
	if (!d) return null;
	const count = shelves.length;

	const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
		const next =
			e.key === "ArrowRight" || e.key === "ArrowDown"
				? (index + 1) % METHODS.length
				: e.key === "ArrowLeft" || e.key === "ArrowUp"
					? (index - 1 + METHODS.length) % METHODS.length
					: e.key === "Home"
						? 0
						: e.key === "End"
							? METHODS.length - 1
							: null;
		if (next === null) return;
		e.preventDefault();
		const m = METHODS[next];
		if (!m) return;
		setMethod(m);
		tabs.current[next]?.focus();
	};

	return (
		<>
			<div
				role="tablist"
				aria-label="Shelves"
				className="frame relative grid gap-0.5 rounded-[4px] border border-line bg-panel p-1"
				style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
			>
				<span
					aria-hidden="true"
					className="absolute top-1 bottom-1 left-1 z-0 rounded-[3px] border border-line bg-panel-2 transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none"
					style={{
						width: `calc((100% - 8px) / ${count})`,
						transform: `translateX(calc(${index * 100}% + ${index}px))`,
					}}
				/>
				{METHODS.map((m, i) => (
					<button
						key={m}
						ref={(el) => {
							tabs.current[i] = el;
						}}
						type="button"
						role="tab"
						id={`tab-${m}`}
						aria-selected={d.key === m}
						aria-controls="brew-panel"
						tabIndex={d.key === m ? 0 : -1}
						onClick={() => setMethod(m)}
						onKeyDown={onKeyDown}
						className={cn(
							"font-readout relative z-[1] cursor-pointer rounded-[3px] px-2.5 py-3 text-[0.82rem] font-medium tracking-[0.04em] transition-colors",
							d.key === m ? "text-ink" : "text-dim hover:text-ink",
						)}
					>
						{shelves[i]?.label}
					</button>
				))}
			</div>

			<div
				id="brew-panel"
				role="tabpanel"
				aria-labelledby={`tab-${d.key}`}
				className="frame mt-[clamp(28px,4vh,44px)] grid gap-[clamp(20px,3vw,40px)] md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]"
			>
				<div className="relative order-first aspect-video overflow-hidden rounded-[4px] border border-line bg-panel md:order-last md:aspect-auto md:min-h-full">
					{shelves.map((shelf) => (
						<Image
							key={shelf.key}
							src={shelf.image.src}
							alt={shelf.key === d.key ? shelf.image.alt : ""}
							aria-hidden={shelf.key !== d.key}
							fill
							sizes="(max-width: 768px) 100vw, 620px"
							className={cn(
								"object-cover transition-opacity duration-300 motion-reduce:transition-none",
								shelf.key === d.key ? "opacity-100" : "opacity-0",
							)}
						/>
					))}
				</div>

				<div className="flex flex-col rounded-[4px] border border-line bg-panel p-[clamp(20px,2.4vw,28px)]">
					<div className="mb-1.5 flex items-baseline justify-between gap-2.5 border-b border-line pb-3.5">
						<span className="font-readout text-[0.86rem] font-medium tracking-[0.16em] text-ink">
							{d.label.toUpperCase()}
						</span>
						<span className="font-readout text-[0.7rem] tracking-[0.12em] text-faint">{d.code}</span>
					</div>
					<dl className="flex flex-col">
						{d.spec.map(([label, value]) => (
							<div
								key={label}
								className="flex items-baseline justify-between gap-4 border-b border-line-2 py-3"
							>
								<dt className="font-readout text-[0.72rem] tracking-[0.1em] text-faint uppercase">{label}</dt>
								<dd className="font-readout text-[1.12rem] font-medium text-ink">
									<Odometer value={value} />
								</dd>
							</div>
						))}
					</dl>
					<ol className="mt-[18px] flex flex-col gap-[9px]">
						{d.lines.map((line, i) => (
							<li key={line.href} className="relative pl-[30px] text-[0.9rem] leading-normal text-dim">
								<span
									aria-hidden="true"
									className="font-readout absolute top-[.1em] left-0 text-[0.72rem] tracking-[0.06em] text-copper"
								>
									0{i + 1}
								</span>
								<Link href={line.href} className="transition-colors hover:text-ink">
									{line.name}
									{line.price ? ` · ${line.price}` : ""}
								</Link>
							</li>
						))}
					</ol>
					<p className="font-readout mt-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-line pt-4 text-[0.78rem]">
						<span className="tracking-[0.1em] text-faint uppercase">The whole shelf</span>
						<Link
							href={d.href}
							className="min-w-0 text-copper underline decoration-line underline-offset-4 hover:decoration-copper"
						>
							Open {d.label} <span aria-hidden="true">→</span>
						</Link>
					</p>
				</div>
			</div>
		</>
	);
}
