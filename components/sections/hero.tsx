"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type HeroSlide = {
	eyebrow: string;
	headline: string;
	note: string;
	image: string;
	href: string;
};

const INTERVAL_MS = 6500;

/**
 * Full-height campaign slider under the transparent masthead: crossfading photographs, a
 * monospace shot note top right and dash indicators. `data-hero` tells the masthead to sit
 * transparent over it (globals.css).
 */
export function Hero({ slides }: { slides: HeroSlide[] }) {
	const [active, setActive] = useState(0);
	const [paused, setPaused] = useState(false);

	useEffect(() => {
		if (paused || slides.length < 2) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const timer = setInterval(() => setActive((i) => (i + 1) % slides.length), INTERVAL_MS);
		return () => clearInterval(timer);
	}, [paused, slides.length]);

	return (
		<section
			data-hero
			aria-label="Campaign"
			className="relative h-[calc(100svh-36px)] min-h-[560px] overflow-hidden bg-stage text-white"
			onFocus={() => setPaused(true)}
			onBlur={() => setPaused(false)}
		>
			{slides.map((slide, i) => (
				<div
					key={slide.image}
					aria-hidden={i !== active}
					className={cn(
						"absolute inset-0 transition-opacity duration-[900ms]",
						i === active ? "opacity-100" : "pointer-events-none opacity-0",
					)}
				>
					<Image src={slide.image} alt="" fill sizes="100vw" priority={i === 0} className="object-cover" />
					<div className="absolute inset-0 bg-linear-to-t from-ink/60 via-ink/10 to-ink/30" />
					<div className="absolute inset-x-5 bottom-16 flex flex-col items-start gap-5 lg:inset-x-9">
						<p className="text-[11px] tracking-[0.28em]">{slide.eyebrow}</p>
						{i === 0 ? (
							<h1 className="max-w-[16ch] text-[clamp(28px,3.4vw,46px)] font-normal uppercase leading-[1.15] tracking-[0.2em]">
								{slide.headline}
							</h1>
						) : (
							<p className="max-w-[16ch] text-[clamp(28px,3.4vw,46px)] font-normal uppercase leading-[1.15] tracking-[0.2em]">
								{slide.headline}
							</p>
						)}
						<Link
							href={slide.href}
							tabIndex={i === active ? undefined : -1}
							className="link-u text-[10px] uppercase tracking-[0.22em]"
						>
							Shop now
						</Link>
					</div>
					<p
						aria-hidden
						className="note absolute right-5 top-[calc(var(--header-h)+24px)] text-white/70 lg:right-9"
					>
						{slide.note}
					</p>
				</div>
			))}
			{slides.length > 1 && (
				<div className="absolute bottom-5 left-5 z-[3] flex gap-2 lg:left-9">
					{slides.map((slide, i) => (
						<button
							key={slide.image}
							type="button"
							aria-label={`Show slide ${i + 1} of ${slides.length}`}
							aria-current={i === active}
							onClick={() => setActive(i)}
							className="flex h-6 w-[34px] cursor-pointer items-center"
						>
							<span
								aria-hidden
								className={cn(
									"block h-[2px] w-full transition-colors duration-300",
									i === active ? "bg-white" : "bg-white/40",
								)}
							/>
						</button>
					))}
				</div>
			)}
		</section>
	);
}
