"use client";

import { ChevronLeftIcon, ChevronRightIcon, ShoppingBagIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BtnLabel } from "@/components/grilli/btn-label";
import { isBundled } from "@/lib/editorial";
import { YNSMedia } from "@/lib/yns-media";

export type HeroSlide = {
	id: string;
	kicker: string;
	title: [string, string];
	text: string;
	href: string;
	cta: string;
	image: string | null;
};

const INTERVAL = 7000;

/** The original's full-bleed slider: cross-fading slides, a slow zoom, the copy rising in line by line. */
export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
	const [index, setIndex] = useState(0);
	const [moved, setMoved] = useState(false);
	const [paused, setPaused] = useState(false);
	const count = slides.length;

	const go = (next: number) => {
		setMoved(true);
		setIndex((next + count) % count);
	};

	useEffect(() => {
		if (count < 2 || paused) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const timer = setInterval(() => {
			setMoved(true);
			setIndex((current) => (current + 1) % count);
		}, INTERVAL);
		return () => clearInterval(timer);
	}, [count, paused]);

	return (
		<section
			aria-roledescription="carousel"
			aria-label="Highlights"
			data-hero
			onFocusCapture={() => setPaused(true)}
			onBlurCapture={() => setPaused(false)}
			className="relative isolate min-h-svh overflow-hidden bg-smoky py-[120px] text-center xl:h-[880px] xl:min-h-0"
		>
			{slides.map((slide, i) => {
				const Title = i === 0 ? "h1" : "p";
				return (
					<div
						key={slide.id}
						className="hero-slide"
						data-active={i === index}
						data-first={i === 0 && !moved}
						aria-hidden={i !== index}
					>
						<div className="hero-slide-bg">
							{slide.image && isBundled(slide.image) && (
								<Image
									src={slide.image}
									alt=""
									fill
									sizes="100vw"
									priority={i === 0}
									className="object-cover"
								/>
							)}
							{slide.image && !isBundled(slide.image) && (
								<YNSMedia
									src={slide.image}
									alt=""
									fill
									sizes="100vw"
									priority={i === 0}
									className="object-cover"
								/>
							)}
							<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(14_13_11/0.55)_0%,rgb(14_13_11/0.82)_70%)]" />
						</div>
						<p className="hero-reveal section-subtitle after:mt-3.5! after:mb-5!">{slide.kicker}</p>
						<Title className="hero-reveal font-display text-display text-white">
							{slide.title[0]}
							<br />
							{slide.title[1]}
						</Title>
						<p className="hero-reveal mx-auto mt-2.5 mb-10 max-w-2xl text-body-2 text-white xs:text-[1.25rem]">
							{slide.text}
						</p>
						<div className="hero-reveal">
							<Link href={slide.href} className="btn-g mx-auto" tabIndex={i === index ? undefined : -1}>
								<BtnLabel>{slide.cta}</BtnLabel>
							</Link>
						</div>
					</div>
				);
			})}

			{count > 1 && (
				<>
					<button
						type="button"
						onClick={() => go(index - 1)}
						aria-label="Previous slide"
						className="absolute top-1/2 left-[30px] z-10 hidden size-[45px] -translate-y-1/2 rotate-45 cursor-pointer place-items-center border border-gold text-gold transition-colors hover:bg-gold hover:text-black md:grid"
					>
						<ChevronLeftIcon className="size-6 -rotate-45" aria-hidden="true" />
					</button>
					<button
						type="button"
						onClick={() => go(index + 1)}
						aria-label="Next slide"
						className="absolute top-1/2 right-[30px] z-10 hidden size-[45px] -translate-y-1/2 rotate-45 cursor-pointer place-items-center border border-gold text-gold transition-colors hover:bg-gold hover:text-black md:grid"
					>
						<ChevronRightIcon className="size-6 -rotate-45" aria-hidden="true" />
					</button>
				</>
			)}

			<Link
				href="/products"
				className="spin-frame absolute right-[15px] bottom-[15px] z-10 flex size-[110px] scale-60 flex-col items-center justify-center gap-1.5 bg-gold p-3 text-center text-black xs:scale-70 xl:right-[50px] xl:bottom-[50px] xl:scale-100"
			>
				<ShoppingBagIcon className="size-9" strokeWidth={1.25} aria-hidden="true" />
				<span className="text-label-2 leading-normal font-bold tracking-1 uppercase">Shop Online</span>
			</Link>
		</section>
	);
}
