import Link from "next/link";
import { Carousel } from "@/components/carousel";
import { type BannerSlide, getBannerSlides } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

/** Tilted, white-framed prints: the original banner's photo-collage artwork, from the store's own photos. */
const PRINTS = [
	"right-[32%] top-[14%] w-[34%] -rotate-[9deg] sm:right-[33%] sm:w-[23%]",
	"right-[6%] top-[4%] w-[36%] rotate-[7deg] sm:right-[9%] sm:w-[25%]",
	"right-[18%] top-[48%] w-[30%] rotate-[-3deg] sm:right-[20%] sm:top-[40%] sm:w-[19%]",
];

function Caption({ slide, first }: { slide: BannerSlide; first: boolean }) {
	const Title = first ? "h1" : "h2";
	return (
		<div className="relative z-10 flex h-full max-w-[22rem] flex-col items-center justify-start px-6 pt-8 text-center sm:max-w-[30rem] sm:justify-center sm:pt-0 lg:ml-[6%]">
			<span aria-hidden className="h-px w-28 bg-banner-rule sm:w-48" />
			<p className="mt-5 font-display text-[0.8rem] uppercase tracking-[0.3em] sm:text-base">
				{slide.kicker}
			</p>
			<Title className="mt-2 font-display text-[2rem] uppercase leading-[1.05] tracking-[0.08em] text-banner-accent sm:text-5xl lg:text-6xl">
				{slide.title}
			</Title>
			<Link
				href={slide.href}
				className="mt-5 inline-flex h-9 items-center rounded-md border border-banner-foreground/80 px-4 text-xs font-medium uppercase tracking-[0.2em] transition-colors hover:bg-banner-foreground hover:text-banner sm:mt-6"
			>
				{slide.cta}
			</Link>
			<span aria-hidden className="mt-6 hidden h-px w-48 bg-banner-rule sm:block" />
		</div>
	);
}

function Slide({ slide, first }: { slide: BannerSlide; first: boolean }) {
	return (
		<div className="relative h-96 w-full overflow-hidden bg-banner text-banner-foreground">
			{slide.kind === "photo" ? (
				<div className="absolute inset-x-0 bottom-0 h-[42%] sm:inset-0 sm:h-full">
					<YNSMedia
						src={slide.image}
						alt=""
						fill
						sizes="(min-width: 768px) 80vw, 100vw"
						priority={first}
						className="object-cover object-[78%_18%] sm:object-contain sm:object-right"
					/>
				</div>
			) : (
				<div aria-hidden className="absolute inset-0">
					{slide.images.map((image, i) => (
						<div
							key={image}
							className={cn(
								"absolute aspect-square bg-white p-[3%] shadow-[0_10px_30px_-12px_rgb(0_0_0/0.35)] max-sm:top-auto max-sm:bottom-[4%]",
								PRINTS[i],
								i === 2 && "max-sm:hidden",
							)}
						>
							<div className="relative h-full w-full overflow-hidden">
								<YNSMedia
									src={image}
									alt=""
									fill
									sizes="(min-width: 640px) 22vw, 35vw"
									priority={first}
									className="object-cover"
								/>
							</div>
						</div>
					))}
				</div>
			)}
			<Caption slide={slide} first={first} />
		</div>
	);
}

export async function Banner() {
	const slides = await getBannerSlides();
	if (slides.length === 0) return null;
	return (
		<Carousel
			label="Featured"
			slides={slides.map((slide, i) => (
				<Slide key={slide.href + slide.title} slide={slide} first={i === 0} />
			))}
		/>
	);
}
