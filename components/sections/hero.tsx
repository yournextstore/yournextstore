import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative w-full overflow-hidden">
			<div className="relative h-[78vh] min-h-[560px] sm:h-[88vh] sm:min-h-[640px] w-full realm-noise">
				<Image
					src="/scraped-0.jpg"
					alt="A considered home — sun-warmed oak, sage vessel, frosted glow"
					fill
					priority
					sizes="100vw"
					className="object-cover object-center"
				/>
				{/* warm wood vignette overlay */}
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_55%,transparent_0%,rgba(45,28,15,0.35)_70%,rgba(30,18,10,0.55)_100%)]" />
				<div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#1f140c]/30 to-transparent" />
				<div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#1f140c]/40 to-transparent" />

				{/* Headline */}
				<div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
					<h1 className="font-serif text-white text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-[-0.015em] drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)] max-w-3xl">
						The New Standard
						<br />
						<span className="italic font-light">of Considered Living</span>
					</h1>
					<YnsLink
						prefetch={"eager"}
						href="#products"
						className="realm-pill mt-10 inline-flex items-center justify-center h-12 px-9 rounded-full bg-[#f2ebdd] text-[#3e2a1c] text-[11px] tracking-[0.32em] uppercase font-medium hover:bg-white"
					>
						Enter the Store
					</YnsLink>
				</div>

				{/* subtle compass mark, bottom center */}
				<div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.4em] uppercase text-white/55">
					Est. — Your Next Store
				</div>
			</div>
		</section>
	);
}
