import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { getStoreSeo } from "@/lib/commerce";

/** "About <store>": a wide photograph, then a large statement beside two short paragraphs. */
export async function Story() {
	"use cache";
	cacheLife("hours");
	const { storeName } = await getStoreSeo();

	return (
		<section className="layout">
			<div className="col-span-full">
				<h2 className="mb-8 text-title-md md:mb-16 md:text-title-2xl">About {storeName}</h2>
				<Image
					src="/images/interiors/story-dining-room.jpg"
					width={1920}
					height={1280}
					alt="An oak dining table with paper-cord chairs under an opal glass pendant, a grey sofa beyond"
					sizes="(max-width: 1400px) 100vw, 1368px"
					className="mb-8 h-auto w-full max-md:aspect-[3/2] max-md:object-cover md:mb-16"
				/>
			</div>
			<p className="col-span-full font-medium text-title-md md:col-span-6 md:text-title-2xl">
				At {storeName}, we believe a home should feel calm, warm and easy to live in.
			</p>
			<div className="col-span-full mt-6 md:col-start-8 md:col-end-13 md:mt-19 md:text-title-md">
				<p className="mb-5 md:mb-9">
					We make sofas, chairs, tables and lamps with clean lines and honest materials: solid oak, wool,
					linen, leather and stone.
				</p>
				<p className="mb-5 md:mb-3">
					Every piece is drawn to sit quietly in a room and to be used every day, from the first coffee to the
					last lamp switched off.
				</p>
				<Link href="/about" className="link-underline">
					Read more about {storeName}
				</Link>
			</div>
		</section>
	);
}
