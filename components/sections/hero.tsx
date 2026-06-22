import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative isolate -mt-px overflow-hidden bg-ink">
			<div className="relative h-[88svh] min-h-[640px] w-full">
				<Image
					src="/scraped-0.jpg"
					alt=""
					fill
					priority
					sizes="100vw"
					className="object-cover object-center"
				/>
				{/* cinematic vignette + warm tint */}
				<div
					aria-hidden
					className="absolute inset-0"
					style={{
						background:
							"radial-gradient(ellipse at 50% 40%, rgba(10,8,7,0) 30%, rgba(10,8,7,0.55) 78%, rgba(10,8,7,0.9) 100%)",
					}}
				/>
				<div
					aria-hidden
					className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/80 via-ink/40 to-transparent"
				/>
				<div
					aria-hidden
					className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink to-transparent"
				/>

				{/* pull-quote */}
				<div className="absolute inset-0 flex items-center justify-center px-8">
					<div className="text-center">
						<p
							className="font-serif-display text-3xl italic sm:text-5xl lg:text-6xl"
							style={{ color: "#F5D14A", textShadow: "0 2px 24px rgba(0,0,0,0.45)" }}
						>
							&ldquo;I&rsquo;m drowning in it.&rdquo;
						</p>
						<div className="mt-6 flex items-center justify-center gap-3 text-[10px] tracking-microcaps text-bone/70">
							<span className="h-px w-10 bg-bone/30" />
							<span>Chapter I — Vertigo</span>
							<span className="h-px w-10 bg-bone/30" />
						</div>
					</div>
				</div>

				{/* now-playing chip */}
				<div className="pointer-events-auto absolute bottom-8 right-6 z-10 hidden w-[230px] sm:block">
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="group block border border-bone/15 bg-ink/55 p-3 backdrop-blur-md transition-colors hover:bg-ink/75"
					>
						<div className="flex items-center justify-between text-[9px] tracking-microcaps text-bone/60">
							<span>Now Playing</span>
							<span>01 / 06</span>
						</div>
						<div className="mt-3 flex items-center gap-3">
							<div className="relative h-16 w-16 shrink-0 overflow-hidden border border-bone/10 bg-ink">
								<Image src="/scraped-1.jpg" alt="" fill sizes="64px" className="object-cover" />
							</div>
							<div className="min-w-0">
								<p className="font-serif-display text-base leading-tight text-bone">Vertigo</p>
								<p className="mt-1 text-[10px] tracking-caps text-bone/55">Eau de Parfum</p>
							</div>
						</div>
						<div className="mt-3 flex items-center justify-between border-t border-bone/10 pt-2">
							<span className="text-[10px] tracking-caps text-bone/65">Discover</span>
							<span className="font-serif-display text-base text-saffron">→</span>
						</div>
					</YnsLink>
				</div>

				{/* scroll cue */}
				<div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-[10px] tracking-microcaps text-bone/55 lg:block">
					Scroll
					<span className="ml-2 inline-block h-3 w-px translate-y-[2px] bg-bone/40" />
				</div>
			</div>
		</section>
	);
}
