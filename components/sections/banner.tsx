import Link from "next/link";
import { editorialImages } from "@/lib/catalog";
import { YNSMedia } from "@/lib/yns-media";

/** The mid-page banner: a 440px photograph with a centred white statement and an "About us" pill. */
export function Banner() {
	const image = editorialImages.banner;

	return (
		<section className="shell section-y">
			<div className="relative h-[27.5rem] overflow-hidden bg-ink md:h-[29.875rem]">
				<YNSMedia
					src={image.src}
					alt=""
					fill
					sizes="(min-width: 1440px) 1328px, 100vw"
					className="object-cover"
				/>
				<div className="absolute inset-0 bg-black/40" />
				<div className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center text-white">
					<h2 className="text-heading-md">Made to be lived on</h2>
					<p className="mt-2 text-lead md:max-w-[37.5rem]">
						Boucle, linen, solid ash and stone: read how we choose the materials and shapes behind every
						piece.
					</p>
					<Link href="/about" className="pill mt-8">
						About us
					</Link>
				</div>
			</div>
		</section>
	);
}
