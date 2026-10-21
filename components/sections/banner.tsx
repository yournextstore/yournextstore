import Image from "next/image";
import Link from "next/link";
import { getFeaturedBanner } from "@/lib/catalog";
import bannerImage from "@/public/images/banner.jpg";

/** The original's black "#COLLECTION" band: bordered copy panel beside a fashion photograph. */
export async function Banner() {
	const banner = await getFeaturedBanner();

	return (
		<section className="page-x w-full bg-ink py-4 text-ink-foreground lg:py-8">
			<div className="grid grid-cols-1 items-stretch lg:grid-cols-2">
				<div className="flex h-full flex-col justify-between rounded-sm border border-ink-line p-6">
					<div className="mb-8 lg:mb-48">
						<span className="mb-2 inline-block rounded-sm border border-ink-line px-4 py-1 text-label-sm font-light uppercase">
							#{banner.tag}
						</span>
						<h2 className="text-title font-medium uppercase md:text-[3.5rem] md:leading-[4rem]">
							{banner.name}: already broken in
						</h2>
						<p className="mt-2 max-w-lg text-label-lg font-light">
							Secondhand pieces with the fades, creases and soft spots that only years of wear can give.
						</p>
					</div>
					<Link
						href={banner.href}
						className="w-fit rounded-sm bg-ink-foreground/10 px-6 py-2 text-label uppercase transition-colors hover:bg-ink-foreground/20"
					>
						Explore
					</Link>
				</div>
				<div className="relative aspect-[4/3] lg:aspect-auto">
					<Image
						src={bannerImage}
						alt=""
						fill
						sizes="(min-width: 1024px) 50vw, 100vw"
						className="rounded-sm object-cover object-top"
					/>
				</div>
			</div>
		</section>
	);
}
