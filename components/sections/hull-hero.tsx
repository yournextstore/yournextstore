import Link from "next/link";
import { YNSMedia } from "@/lib/yns-media";

/**
 * The original's hero module: a full-screen photograph with the headline, a line of copy and a
 * pill centred over it. The photograph is bright and airy, so the type is ink and set in the
 * lower third.
 */
export function HullHero({
	headline,
	subline,
	cta,
	image,
}: {
	headline: string;
	subline: string;
	cta: { href: string; label: string };
	image: string | null;
}) {
	return (
		<section className="relative grid min-h-[calc(100svh-106px)] overflow-hidden border-b border-border bg-[#f7f6f3] md:min-h-[calc(100svh-131px)]">
			{image && (
				<div className="absolute inset-x-0 top-0 h-[62%] [mask-image:linear-gradient(to_bottom,black_75%,transparent)] md:h-full md:[mask-image:none]">
					<YNSMedia
						src={image}
						alt=""
						fill
						priority
						sizes="100vw"
						className="object-cover object-[30%_50%] md:object-[50%_40%]"
					/>
				</div>
			)}
			<div className="relative z-10 flex flex-col items-center justify-end px-4 pt-[50svh] pb-14 text-center text-black md:pt-[48svh] md:pb-20">
				<h1 className="text-display">{headline}</h1>
				<p className="mt-4 max-w-xl text-body">{subline}</p>
				<Link
					href={cta.href}
					className="hull-btn hull-btn-large mt-8 [--btn-bg:#000] [--btn-fg:#fff] [--btn-hover-bg:#fff] [--btn-hover-fg:#000] [--btn-ink:#000]"
				>
					{cta.label}
				</Link>
			</div>
		</section>
	);
}
