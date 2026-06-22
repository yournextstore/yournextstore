import Image from "next/image";
import { YnsLink } from "../yns-link";

export function FounderStory() {
	return (
		<section className="bg-[#E8DFD3]/40">
			<div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-12 lg:gap-16 lg:px-8">
				<div className="relative lg:col-span-5">
					<div className="relative aspect-[4/5] overflow-hidden rounded-sm yns-sepia">
						<Image
							src="/scraped-5.jpg"
							alt="Founder portrait"
							fill
							sizes="(max-width: 1024px) 100vw, 40vw"
							className="object-cover"
						/>
					</div>
				</div>
				<div className="lg:col-span-7">
					<p className="text-[11px] yns-letter-spacing-mid uppercase text-muted-foreground">A note from us</p>
					<h2 className="mt-3 font-serif text-4xl sm:text-5xl font-light leading-[1.05] text-foreground">
						We started with one <em className="italic">scruffy little muse.</em>
					</h2>
					<div className="mt-6 space-y-4 max-w-xl text-base leading-relaxed text-muted-foreground">
						<p>
							Our first dog had sensitive skin, a strong opinion about baths, and the kind of soft coat that
							deserved better than the chemistry under the kitchen sink.
						</p>
						<p>
							So we built a small line of grooming essentials we&apos;d feel good about — quietly effective,
							thoughtfully scented, and gentle enough for the most particular paws in the house. Everything we
							ship is something we&apos;d hand a friend.
						</p>
					</div>
					<YnsLink
						prefetch="eager"
						href="/faq"
						className="mt-10 inline-flex border-b border-foreground/60 pb-1 text-[11px] yns-letter-spacing-mid uppercase text-foreground hover:border-foreground"
					>
						Read our story
					</YnsLink>
				</div>
			</div>
		</section>
	);
}
