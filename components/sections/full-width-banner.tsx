import Image from "next/image";

export function FullWidthBanner() {
	return (
		<section className="relative w-full h-[40vh] sm:h-[50vh]">
			<Image src="/scraped-13.png" alt="Desk organization setup" fill className="object-cover" />
			<div className="absolute inset-0 bg-black/10" />
		</section>
	);
}
