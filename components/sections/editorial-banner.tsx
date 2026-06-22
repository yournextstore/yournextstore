import Image from "next/image";
import { YnsLink } from "../yns-link";

export function EditorialBanner() {
	return (
		<section className="bg-background">
			<div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-12 lg:py-24">
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
					<div className="relative col-span-1 overflow-hidden bg-lilac-soft lg:col-span-7">
						<div className="relative aspect-[4/5] w-full lg:aspect-[5/6]">
							<Image
								src="/scraped-3.jpg"
								alt="Resort 26 editorial"
								fill
								sizes="(max-width: 1024px) 100vw, 58vw"
								className="object-cover"
							/>
						</div>
						<div className="absolute left-6 top-6 max-w-xs">
							<p className="text-[11px] uppercase tracking-[0.28em] text-background mix-blend-difference">
								Editorial 04
							</p>
							<h3 className="font-display mt-2 text-3xl font-medium leading-tight tracking-[-0.01em] text-background mix-blend-difference sm:text-4xl">
								The Soft Hours
							</h3>
						</div>
					</div>

					<div className="col-span-1 flex flex-col gap-4 lg:col-span-5">
						<div className="relative flex h-full flex-col justify-between bg-foreground p-8 text-background lg:p-10">
							<div>
								<p className="text-[11px] uppercase tracking-[0.28em] text-lilac">Featured Story</p>
								<h3 className="font-display mt-4 text-3xl font-medium leading-tight tracking-[-0.01em] sm:text-4xl">
									A study in lilac, ivory and ink.
								</h3>
								<p className="mt-5 text-sm leading-relaxed text-background/70">
									Our resort edit takes its cues from the still-life paintings of the early 1960s — soft
									pleats, cropped tailoring and a palette built around lavender, bone and deepest black.
								</p>
							</div>
							<YnsLink
								href="/products"
								className="mt-8 inline-flex w-fit items-center gap-2 border-b border-background pb-1 text-[11px] uppercase tracking-[0.22em]"
							>
								Read the edit
							</YnsLink>
						</div>
						<div className="relative aspect-[5/4] w-full overflow-hidden bg-secondary lg:aspect-auto lg:h-44">
							<Image
								src="/scraped-5.jpg"
								alt="Garment detail"
								fill
								sizes="(max-width: 1024px) 100vw, 35vw"
								className="object-cover"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
