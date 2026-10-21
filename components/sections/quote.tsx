import Image from "next/image";
import { getStoreBasics } from "@/lib/catalog";
import { QUOTE_IMAGE } from "@/lib/editorial";

/** The original's testimonial band, carrying the store's own words over a darkened photograph. */
export async function Quote() {
	const { description, storeName } = await getStoreBasics();
	const words =
		description ??
		"If it is good enough for the pass, it is good enough for your table: that is the only rule of our larder.";

	return (
		<section
			aria-label="In our words"
			className="relative isolate overflow-hidden py-[70px] text-center lg:py-[100px]"
		>
			<div aria-hidden="true" className="absolute inset-0 -z-10 bg-smoky">
				<Image src={QUOTE_IMAGE} alt="" fill sizes="100vw" className="object-cover opacity-40" />
				<div className="absolute inset-0 bg-smoky/70" />
			</div>
			<div className="container-g">
				<p aria-hidden="true" className="font-display text-[4.375rem] leading-[0.7] text-white">
					&rdquo;
				</p>
				<blockquote className="mx-auto max-w-[910px] font-display text-headline-2 text-white">
					{words}
				</blockquote>
				<div className="mt-10 mb-[50px] flex justify-center gap-0.5" aria-hidden="true">
					<span className="diamond diamond-spin" />
					<span className="diamond diamond-spin" />
					<span className="diamond diamond-spin" />
				</div>
				<p className="text-label-2 font-bold tracking-3 text-gold uppercase">{storeName}</p>
			</div>
		</section>
	);
}
