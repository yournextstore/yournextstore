import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Lifestyle() {
	return (
		<section id="about" className="bg-background py-20 sm:py-28">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
				<div className="relative aspect-[4/5] rounded-sm overflow-hidden shadow-2xl">
					<Image
						src="/scraped-2.jpg"
						alt="Sun-drenched terrace with a chilled glass"
						fill
						sizes="(max-width: 1024px) 100vw, 50vw"
						className="object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-tr from-espresso/30 via-transparent to-transparent" />
				</div>
				<div>
					<p className="font-script text-2xl text-terracotta mb-4">A sip of slow afternoons</p>
					<h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-espresso leading-[1.05] mb-8">
						Brewed for the
						<br />
						unhurried hours.
					</h2>
					<p className="text-espresso/70 text-base sm:text-lg leading-relaxed mb-6 max-w-lg">
						We started in a tiny copper kettle behind an old roastery, chasing the moment when espresso meets
						late-summer citrus. Every can is a postcard from that terrace — slow-pressed, lightly sparkling,
						and built to be lingered over.
					</p>
					<p className="text-espresso/70 text-base leading-relaxed mb-10 max-w-lg">
						No alcohol. No shortcuts. Just bright, layered flavor that makes the day feel a little longer.
					</p>
					<YnsLink prefetch={"eager"} href="/products" className="btn-outline-espresso">
						Discover the Story
					</YnsLink>
				</div>
			</div>
		</section>
	);
}
