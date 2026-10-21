"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ShowcaseProduct } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

/** The original's five can colours: black cherry, grape, lemon-lime, strawberry lemonade, watermelon. */
const FLAVOUR_COLOURS = ["#710523", "#572981", "#164405", "#690b3d", "#4b7002"];

/**
 * "Choose your flavor": arrows either side of a slowly turning wavy blob, the product spinning in
 * on change, the panel washing over to the next flavour colour. The 3D can is the product photo
 * on a cream disc; the spin is a CSS transform keyed to the slide.
 */
export function FlavourPicker({ items }: { items: ShowcaseProduct[] }) {
	const [index, setIndex] = useState(0);
	const count = items.length;
	const current = items[index];
	if (!current) return null;
	const colour = FLAVOUR_COLOURS[index % FLAVOUR_COLOURS.length] ?? "#710523";

	const go = (step: 1 | -1) => {
		setIndex((i) => (i + step + count) % count);
	};

	return (
		<section
			aria-labelledby="flavour-heading"
			className="relative grid min-h-[min(100svh,56rem)] grid-rows-[auto_1fr_auto] justify-items-center overflow-hidden px-4 py-12 text-white transition-colors duration-1000"
			style={{ backgroundColor: `color-mix(in srgb, ${colour} 72%, white)` }}
		>
			<svg
				aria-hidden="true"
				viewBox="0 0 1165 1166"
				className="pointer-events-none absolute left-1/2 top-1/2 h-[120vmin] -translate-x-1/2 -translate-y-1/2 transition-colors duration-1000"
				style={{ color: colour }}
			>
				<path
					className="wavy-outer"
					fill="currentColor"
					opacity="0.5"
					d="M1133.5 619c-5 76.2-84.8 126.7-113.5 183.3-28.7 56.6-20.8 149-74 195.6-53 46.6-143.6 26.9-203.4 48-59.9 21.2-120.2 93.8-196.5 88.9-76.2-5-126.6-86.2-183.2-113.5-56.6-28.7-149-20.8-195.6-74-46.7-53-26.9-143.6-46.7-203.4-19.8-59.7-93.7-121.5-88.8-196.4 4.8-74.8 84.8-128 113.6-184.6 28.7-56.6 19.4-149 72.5-195.7 53.1-46.7 143.7-26.9 203.4-46.7C481 100.8 543 26.8 619.1 31.8c76.2 5 126.7 84.7 183.3 113.5 56.6 28.7 149 19.4 195.7 72.5 46.6 53.1 26.8 143.7 48 203.5 19.8 59.7 92.3 121.5 87.4 197.7z"
				/>
				<path
					className="wavy-inner"
					fill="currentColor"
					opacity="0.5"
					d="M827.9 672.6c-12.4 34-55.3 46.3-75.9 68.2-20.5 22-29.2 64.9-59.5 79-30.3 14.2-68.8-6.8-98.7-5.1-30 1.6-67 26.6-101 14.2-33.9-12.3-46-55.9-68-75.8-22-20.5-65-29.2-79-59.5-14.1-30.3 6.9-68.8 5.8-98.6-1-29.7-26.4-67.6-14.2-101 12.1-33.3 55.5-46.9 76-68.8 20.6-21.8 28.6-65 59-79.2 30.2-14.1 68.7 6.9 98.4 5.8 29.8-1 67.7-26.4 101.6-14 34 12.3 46.2 55.2 68.1 75.8 21.9 20.5 65 28.6 79.2 58.9 14.1 30.3-6.9 68.8-5.2 98.8 1 29.7 25.7 67.4 13.4 101.3z"
				/>
			</svg>

			<h2
				id="flavour-heading"
				className="relative text-center text-[clamp(2.4rem,5vw,3rem)] font-bold leading-none"
			>
				Choose your favourite
			</h2>

			<div className="relative grid grid-cols-[auto_auto_auto] items-center gap-2 sm:gap-6">
				<ArrowButton label="Previous" onClick={() => go(-1)}>
					<ChevronLeft className="size-full" strokeWidth={2.5} aria-hidden="true" />
				</ArrowButton>
				<Link
					href={current.href}
					aria-label={current.name}
					className="relative block aspect-square h-[min(62vmin,30rem)] min-h-40 rounded-full"
				>
					<span
						key={current.id}
						className="absolute inset-[8%] block animate-in overflow-hidden rounded-full bg-cream shadow-[0_40px_60px_-30px_rgb(0_0_0/0.55)] duration-700 ease-out fade-in-0 zoom-in-75 spin-in-12"
					>
						<YNSMedia
							src={current.image}
							alt=""
							fill
							sizes="(max-width: 768px) 60vw, 440px"
							className="object-cover"
						/>
					</span>
				</Link>
				<ArrowButton label="Next" onClick={() => go(1)}>
					<ChevronRight className="size-full" strokeWidth={2.5} aria-hidden="true" />
				</ArrowButton>
			</div>

			<div className="relative mx-auto max-w-xl text-center" aria-live="polite">
				<p
					key={current.id}
					className="line-clamp-2 animate-in text-[clamp(1.7rem,3vw,2.25rem)] font-medium leading-tight duration-500 fade-in-0 slide-in-from-bottom-2"
				>
					{current.name}
				</p>
				<p className="mt-2 text-xl opacity-95 md:text-2xl">
					{current.category ? `${current.category} · ` : ""}
					{current.price ?? ""}
				</p>
				<p className="sr-only">
					{index + 1} of {count}
				</p>
				<Link
					href={current.href}
					className="btn btn-sm mt-5 [--btn-bg:#fff] [--btn-fg:var(--ink)] [--btn-hover-bg:var(--sun)]"
				>
					Get this one
				</Link>
			</div>
		</section>
	);
}

function ArrowButton({
	label,
	onClick,
	children,
}: {
	label: string;
	onClick: () => void;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={label}
			className={cn(
				"size-12 rounded-full border-2 border-white bg-white/10 p-2.5 text-white opacity-90 transition hover:bg-white/25 hover:opacity-100 md:size-16 md:p-3 lg:size-20 lg:p-4",
			)}
		>
			{children}
		</button>
	);
}
