import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-cream">
			{/* paper-textured backdrop tint */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0"
				style={{
					backgroundImage:
						"radial-gradient(circle at 10% 20%, rgba(230,51,41,0.06) 0, transparent 30%), radial-gradient(circle at 90% 80%, rgba(168,212,240,0.22) 0, transparent 35%), radial-gradient(circle at 70% 5%, rgba(242,200,75,0.18) 0, transparent 30%)",
				}}
			/>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16 sm:pb-24">
				<h1 className="sr-only">Your Next Store — spreadable, dippable, infinitely enjoyable</h1>

				<div className="relative flex flex-col items-center text-center">
					<div
						className="yns-display text-ink select-none"
						style={{ fontSize: "clamp(4.5rem, 18vw, 15rem)" }}
						aria-hidden="true"
					>
						YOUR&nbsp;NEXT
					</div>

					<div className="relative -my-4 sm:-my-8 lg:-my-12 w-[58%] sm:w-[44%] lg:w-[38%] aspect-[5/3]">
						<div className="absolute inset-0 rounded-[50%] overflow-hidden ring-[10px] ring-cream shadow-[0_30px_60px_-25px_rgba(14,14,14,0.45)]">
							<Image
								src="/scraped-0.jpg"
								alt=""
								fill
								sizes="(max-width: 640px) 60vw, 38vw"
								priority
								className="object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-tr from-ink/15 via-transparent to-mustard/15" />
						</div>
						<div className="absolute -top-4 -right-3 sm:-top-8 sm:-right-10 rotate-12 yns-spin-slow hidden sm:block">
							<div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-mustard flex items-center justify-center text-ink text-[10px] sm:text-xs font-bold uppercase tracking-widest text-center leading-tight">
								New
								<br />
								Drop
							</div>
						</div>
					</div>

					<div
						className="yns-display text-ink select-none"
						style={{ fontSize: "clamp(4.5rem, 18vw, 15rem)" }}
						aria-hidden="true"
					>
						STORE
					</div>

					<div className="absolute right-0 sm:right-2 lg:right-8 bottom-2 sm:bottom-6 yns-wobble">
						<CloudQuote />
					</div>

					<div className="absolute left-1 sm:left-6 bottom-20 sm:bottom-28 -rotate-6 hidden sm:block">
						<div className="rounded-full bg-cherry text-cream px-4 py-2 text-xs font-bold uppercase tracking-widest shadow-lg">
							Small batch
						</div>
					</div>
				</div>

				<div className="relative mt-10 sm:mt-14 flex flex-col sm:flex-row gap-3 items-center justify-center">
					<YnsLink
						prefetch={"eager"}
						href="#products"
						className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-ink text-cream rounded-full text-sm font-semibold uppercase tracking-wider hover:bg-cherry transition-colors"
					>
						Shop the goods
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
							<path
								d="M2 8h12M9 3l5 5-5 5"
								stroke="currentColor"
								strokeWidth="1.8"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</YnsLink>
					<YnsLink
						prefetch={"eager"}
						href="#how-to"
						className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-cream text-ink border-2 border-ink rounded-full text-sm font-semibold uppercase tracking-wider hover:bg-ink hover:text-cream transition-colors"
					>
						How to enjoy
					</YnsLink>
				</div>
			</div>
		</section>
	);
}

function CloudQuote() {
	return (
		<div className="relative w-[210px] sm:w-[250px]">
			<svg
				viewBox="0 0 260 200"
				className="w-full h-auto drop-shadow-[0_8px_18px_rgba(14,14,14,0.18)]"
				aria-hidden="true"
			>
				<title>Cloud pull quote</title>
				<g fill="var(--sky)">
					<circle cx="60" cy="105" r="50" />
					<circle cx="105" cy="70" r="48" />
					<circle cx="165" cy="62" r="52" />
					<circle cx="210" cy="105" r="44" />
					<circle cx="200" cy="150" r="40" />
					<circle cx="140" cy="160" r="46" />
					<circle cx="85" cy="150" r="42" />
				</g>
			</svg>
			<div className="absolute inset-0 flex items-center justify-center px-10 text-center">
				<p className="text-navy font-semibold leading-tight text-sm sm:text-[15px]">
					&ldquo;The (next) <br />
					possibilities are <br />
					endless.&rdquo;
				</p>
			</div>
		</div>
	);
}
