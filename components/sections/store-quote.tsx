import { getStoreInfo } from "@/lib/catalog";

/** The original's centred pull quote, voiced by the store itself rather than an invented customer. */
export async function StoreQuote() {
	const store = await getStoreInfo();
	const text =
		store.description ??
		"We keep a short list of things worth owning, and describe each one plainly so you know what you are getting.";

	return (
		<section className="mx-auto max-w-3xl px-5 py-10 text-center sm:py-16">
			<blockquote className="font-display text-[clamp(22px,3vw,30px)] leading-snug font-semibold">
				“{text}”
			</blockquote>
			<p className="mt-4 text-[14px] text-muted-foreground">— The {store.name} team</p>
		</section>
	);
}
