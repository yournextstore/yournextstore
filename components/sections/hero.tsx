"use client";

import { ArrowRightIcon, Diamond } from "lucide-react";
import dynamic from "next/dynamic";
import { YnsLink } from "../yns-link";

// Dynamically import the 3D scene to avoid SSR issues
const DiamondScene = dynamic(
	() => import("@/components/three/diamond-scene").then((mod) => mod.DiamondScene),
	{ ssr: false }
);

export function Hero() {
	return (
		<section className="relative min-h-[85vh] flex items-center overflow-hidden bg-background">
			{/* 3D Diamond Animation Background */}
			<DiamondScene />

			{/* Gradient overlay for text readability */}
			<div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent pointer-events-none" />

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
				<div className="max-w-2xl">
					{/* Elegant Badge */}
					<div className="inline-flex items-center gap-2 px-4 py-2 border border-primary/30 mb-8 backdrop-blur-sm bg-background/30">
						<Diamond className="h-4 w-4 text-primary" />
						<span className="text-xs tracking-[0.3em] uppercase text-primary font-light">Exquisite Craftsmanship</span>
					</div>

					<h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-foreground leading-[1.1]">
						Timeless
						<span className="block text-primary italic font-serif">Elegance</span>
					</h1>

					<p className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-lg font-light">
						Discover our curated collection of fine jewelry, where each piece tells a story of exceptional artistry and enduring beauty.
					</p>

					<div className="mt-12 flex flex-col sm:flex-row gap-4">
						<YnsLink
							prefetch={"eager"}
							href="#products"
							className="inline-flex items-center justify-center gap-3 h-14 px-10 bg-primary text-primary-foreground text-sm tracking-[0.15em] uppercase font-medium hover:bg-primary/90 transition-all duration-300"
						>
							Explore Collection
							<ArrowRightIcon className="h-4 w-4" />
						</YnsLink>
						<YnsLink
							prefetch={"eager"}
							href="#about"
							className="inline-flex items-center justify-center gap-3 h-14 px-10 border border-foreground/30 text-sm tracking-[0.15em] uppercase font-medium hover:bg-foreground/5 hover:border-foreground/50 transition-all duration-300 backdrop-blur-sm"
						>
							Our Heritage
						</YnsLink>
					</div>

					{/* Trust Indicators */}
					<div className="mt-16 pt-8 border-t border-border/50 flex flex-wrap gap-8">
						<div>
							<p className="text-2xl font-light text-primary">25+</p>
							<p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mt-1">Years of Excellence</p>
						</div>
						<div>
							<p className="text-2xl font-light text-primary">10K+</p>
							<p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mt-1">Happy Clients</p>
						</div>
						<div>
							<p className="text-2xl font-light text-primary">GIA</p>
							<p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mt-1">Certified Diamonds</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
