import Link from "next/link";
import { Em } from "@/components/brand/em";
import { WaveBackdrop } from "@/components/brand/wave-backdrop";
import { ArrowRightIcon } from "@/components/icons";

/** Closing banner: tonal waves on both edges with the text directly on them. Kept short. */
export function Closing() {
	return (
		<section className="relative isolate overflow-hidden">
			<WaveBackdrop />
			<div className="container-page relative flex flex-col items-center py-24 text-center md:py-28">
				<h2 className="max-w-2xl font-display text-title-md text-balance md:text-title-lg">
					Not sure <Em>where to start</Em>?
				</h2>
				<p className="mt-4 max-w-sm text-ink/85">
					Every scent lists its notes from top to base, so you can follow the family you already love.
				</p>
				<Link href="/products" className="btn-glass mt-8">
					Browse all scents
					<ArrowRightIcon width={18} height={18} />
				</Link>
			</div>
		</section>
	);
}
