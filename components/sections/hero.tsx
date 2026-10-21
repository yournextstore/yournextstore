import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getNavData } from "@/lib/nav";

const FALLBACK_DESCRIPTION =
	"Backpacks, totes and travel bags in waxed canvas, recycled nylon and leather, cut plain and built for daily use.";

export async function Hero() {
	"use cache";
	cacheLife("hours");
	const { storeName, storeDescription } = await getNavData();

	return (
		<section className="border-b border-border">
			<div className="shell py-10 md:py-16">
				<div className="text-center">
					<h1 className="text-4xl font-bold tracking-tight text-ink text-balance md:text-5xl">{storeName}</h1>
					<p className="mx-auto mt-4 max-w-2xl text-lg text-ink-soft">
						{storeDescription ?? FALLBACK_DESCRIPTION}
					</p>
					<div className="mt-8 flex flex-wrap justify-center gap-4">
						<Button size="lg" asChild>
							<Link href="/products">Shop All</Link>
						</Button>
						<Button variant="outline" size="lg" asChild>
							<Link href="#collections">Browse Collections</Link>
						</Button>
						<Button variant="outline" size="lg" asChild>
							<Link href="/about">Our Story &rarr;</Link>
						</Button>
					</div>
				</div>
				<div className="relative mt-10 aspect-[4/3] overflow-hidden rounded-lg bg-muted sm:aspect-[21/9] md:mt-14">
					<Image
						src="/images/hero-bags.jpg"
						alt="A waxed-canvas backpack and a canvas tote on an oak bench by a window"
						fill
						priority
						sizes="(min-width: 1280px) 1216px, 100vw"
						className="object-cover"
					/>
				</div>
			</div>
		</section>
	);
}
