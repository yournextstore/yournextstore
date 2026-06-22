import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative w-full overflow-hidden bg-espresso">
			<div className="relative h-[88vh] min-h-[600px] max-h-[860px] w-full">
				<Image
					src="/scraped-0.jpg"
					alt=""
					fill
					priority
					sizes="100vw"
					className="object-cover object-center"
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-espresso/30 via-transparent to-espresso/45" />
				<div className="absolute inset-0 bg-gradient-to-r from-espresso/35 via-transparent to-espresso/25" />

				<div className="relative z-10 h-full flex items-center justify-center px-6">
					<div className="text-center max-w-2xl">
						<p className="eyebrow text-bone/80 mb-7">A New Chapter — Volume Ⅰ</p>
						<h1 className="font-serif text-bone text-5xl sm:text-6xl lg:text-7xl font-light leading-[1.05] tracking-tight">
							Awaken the Everyday.
						</h1>
						<p className="font-serif italic text-bone/90 text-xl sm:text-2xl mt-5 leading-snug">
							Intimate by nature. Intuitive by design.
						</p>
						<div className="mt-10 flex items-center justify-center">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex items-center justify-center gap-2 px-10 py-3.5 bg-bone text-ink eyebrow text-[0.7rem] hover:bg-bone/90 transition-colors"
							>
								Shop the Collection
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
