import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";

function AboutSkeleton() {
	return (
		<section className="bg-background border-t border-foreground py-10 md:py-14 px-5 md:px-10 lg:px-16">
			<div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
				<div className="lg:col-span-7 neo-border bg-[var(--color-surface-container-low)] h-[420px] animate-pulse" />
				<div className="lg:col-span-5 neo-border bg-[var(--color-primary-container)] h-[420px] animate-pulse" />
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<main>
			<Hero />
			<Suspense fallback={<AboutSkeleton />}>
				<About />
			</Suspense>
		</main>
	);
}
