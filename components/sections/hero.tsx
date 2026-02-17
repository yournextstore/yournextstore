"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { YnsLink } from "@/components/yns-link";
import { isVideoUrl } from "@/lib/utils";

const SLIDES = [
	{
		src: "/hero-generated-1.png",
		alt: "Minimalist living room with cream linen sofa and pampas grass",
		eyebrow: "New Collection",
		headline: "Timeless Design,\nModern Living",
		subtitle: "Discover curated furniture that blends form and function for every room.",
		cta: { label: "Shop Collection", href: "/products" },
		ctaSecondary: { label: "Our Story", href: "/products" },
	},
	{
		src: "/hero-generated-2.png",
		alt: "Elegant dining room with walnut table and brass pendant lighting",
		eyebrow: "Studio Sale",
		headline: "Up to 50% Off\nSelected Pieces",
		subtitle: "Our most anticipated sale of the year. Don't miss out.",
		cta: { label: "Shop Sale", href: "/products" },
		ctaSecondary: { label: "View All", href: "/products" },
	},
	{
		src: "/hero-generated-3.png",
		alt: "Serene bedroom with oak bed frame and white linen bedding",
		eyebrow: "Handcrafted",
		headline: "Made With\nIntention",
		subtitle: "Every piece tells a story of craftsmanship and sustainable design.",
		cta: { label: "Explore", href: "/products" },
		ctaSecondary: { label: "Learn More", href: "/products" },
	},
] as const;

const SLIDE_DURATION = 6000;
const CYCLE_DURATION = SLIDES.length * SLIDE_DURATION;
const KEN_BURNS = ["ken-burns-1", "ken-burns-2", "ken-burns-3"] as const;

export function Hero() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [reducedMotion, setReducedMotion] = useState(false);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		setReducedMotion(mq.matches);
		const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, []);

	const startTimer = useCallback(() => {
		if (timerRef.current) clearInterval(timerRef.current);
		if (reducedMotion) return;
		timerRef.current = setInterval(() => {
			setActiveIndex((prev) => (prev + 1) % SLIDES.length);
		}, SLIDE_DURATION);
	}, [reducedMotion]);

	useEffect(() => {
		startTimer();
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [startTimer]);

	const goToSlide = useCallback(
		(index: number) => {
			setActiveIndex(index);
			startTimer();
		},
		[startTimer],
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "ArrowLeft") {
				goToSlide((activeIndex - 1 + SLIDES.length) % SLIDES.length);
			} else if (e.key === "ArrowRight") {
				goToSlide((activeIndex + 1) % SLIDES.length);
			}
		},
		[activeIndex, goToSlide],
	);

	const slide = SLIDES[activeIndex];

	return (
		<section
			className="relative h-[60vh] sm:h-[70vh] lg:h-[85vh] overflow-hidden bg-foreground"
			role="region"
			aria-roledescription="slideshow"
			aria-label="Featured collections"
			onKeyDown={handleKeyDown}
			tabIndex={0}
		>
			{/* Slides */}
			{SLIDES.map((s, i) => {
				const isActive = i === activeIndex;
				const isVideo = isVideoUrl(s.src);

				return (
					<div
						key={s.src}
						className="hero-slide absolute inset-0 transition-opacity duration-1000 ease-in-out"
						style={{ opacity: isActive ? 1 : 0 }}
						aria-hidden={!isActive}
					>
						{isVideo ? (
							<video
								src={s.src}
								muted
								loop
								autoPlay
								playsInline
								className="absolute inset-0 w-full h-full object-cover"
								poster={SLIDES[0].src}
							/>
						) : (
							<Image
								src={s.src}
								alt={s.alt}
								fill
								priority={i === 0}
								loading={i === 0 ? "eager" : "lazy"}
								className="object-cover"
								sizes="100vw"
								style={
									!reducedMotion
										? {
												animation: `${KEN_BURNS[i % KEN_BURNS.length]} ${CYCLE_DURATION}ms ease-in-out infinite alternate`,
											}
										: undefined
								}
							/>
						)}
						{/* Gradient overlay */}
						<div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/10" />
						<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
					</div>
				);
			})}

			{/* Content overlay */}
			<div className="relative h-full flex items-end pb-16 sm:pb-20 lg:pb-24">
				<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
					<div
						key={activeIndex}
						className="hero-content max-w-xl"
						style={
							!reducedMotion
								? { animation: "hero-content-enter 800ms cubic-bezier(0.25, 1, 0.5, 1) forwards" }
								: undefined
						}
					>
						<p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/70 mb-3 sm:mb-4">
							{slide.eyebrow}
						</p>
						<h1
							className="text-[clamp(2rem,5vw,4rem)] font-medium leading-[1.1] tracking-tight text-white mb-4 sm:mb-5 whitespace-pre-line"
							style={{ fontFamily: "var(--font-heading)" }}
						>
							{slide.headline}
						</h1>
						<p className="text-sm sm:text-base text-white/80 leading-relaxed mb-6 sm:mb-8 max-w-md">
							{slide.subtitle}
						</p>
						<div className="flex flex-wrap gap-3">
							<YnsLink
								prefetch="eager"
								href={slide.cta.href}
								className="group inline-flex items-center gap-2 bg-white text-foreground px-6 py-3 text-sm font-medium hover:bg-white/90 transition-colors"
							>
								{slide.cta.label}
								<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
							</YnsLink>
							<YnsLink
								prefetch="eager"
								href={slide.ctaSecondary.href}
								className="inline-flex items-center gap-2 border border-white/40 text-white px-6 py-3 text-sm font-medium hover:bg-white/10 hover:border-white/60 transition-colors"
							>
								{slide.ctaSecondary.label}
							</YnsLink>
						</div>
					</div>
				</div>
			</div>

			{/* Slide indicators */}
			<div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5">
				{SLIDES.map((_, i) => (
					<button
						key={`indicator-${SLIDES[i].src}`}
						type="button"
						onClick={() => goToSlide(i)}
						className={`h-0.5 rounded-full transition-all duration-500 ${
							i === activeIndex ? "w-8 bg-white" : "w-4 bg-white/40 hover:bg-white/60"
						}`}
						aria-label={`Go to slide ${i + 1}`}
						aria-current={i === activeIndex ? "true" : undefined}
					/>
				))}
			</div>
		</section>
	);
}
