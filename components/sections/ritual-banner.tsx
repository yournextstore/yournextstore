import Image from "next/image";
import { YnsLink } from "../yns-link";

export function RitualBanner() {
	return (
		<section className="relative h-[68vh] min-h-[480px] w-full overflow-hidden realm-noise">
			<Image
				src="/scraped-5.jpg"
				alt="A slow morning &mdash; linen, dried botanicals, late light"
				fill
				sizes="100vw"
				className="object-cover object-center"
			/>
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_60%,transparent_0%,rgba(35,22,12,0.45)_75%,rgba(25,15,8,0.6)_100%)]" />

			<div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
				<p className="text-[10px] tracking-[0.45em] uppercase text-white/70 font-light">Chapter Two</p>
				<h2
					className="mt-6 text-white text-6xl sm:text-7xl lg:text-8xl leading-none"
					style={{ fontFamily: "var(--font-script)" }}
				>
					A daily ritual
				</h2>
				<p className="mt-6 max-w-md text-[15px] leading-[1.8] text-white/80">
					Strike a match. Set the kettle. Mist the doorway. The smallest gestures keep a house honest.
				</p>
				<YnsLink
					prefetch="eager"
					href="/products"
					className="realm-pill mt-8 inline-flex items-center justify-center h-11 px-8 rounded-full bg-white text-[#3e2a1c] text-[11px] tracking-[0.32em] uppercase font-medium"
				>
					Begin Yours
				</YnsLink>
			</div>
		</section>
	);
}
