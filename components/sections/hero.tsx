import Image from "next/image";
import Link from "next/link";

/**
 * Full-bleed lifestyle photograph (a full viewport tall from md, under the transparent header),
 * followed by the headline row: a large statement on the left, a short invitation with an
 * underlined link on the right.
 */
export function Hero() {
	return (
		<>
			<div data-hero className="relative">
				<Image
					src="/images/interiors/hero-living-room.jpg"
					width={1920}
					height={1280}
					alt="A grey sofa, an oak lounge chair and a round oak coffee table on a sisal rug in a concrete-walled living room"
					priority
					sizes="100vw"
					className="h-auto w-full md:h-screen md:object-cover"
				/>
			</div>
			<div className="layout pt-8 md:pt-26">
				<h1 className="col-span-full text-title-md max-md:mb-6 md:col-span-7 md:text-title-2xl">
					Calm, Well-Made Furniture for the Rooms You Live In
				</h1>
				<div className="col-span-full flex items-center md:col-start-9 md:col-end-13">
					<div className="md:text-title-md">
						<p>Find the piece your room is missing</p>
						<Link href="/products" className="link-underline">
							Explore Now
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
