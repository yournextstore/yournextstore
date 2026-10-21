import { Leaf, Sparkles, Sun } from "lucide-react";
import Link from "next/link";

/**
 * The original's plum announcement strip: three short notes across the page on desktop,
 * the middle one alone on a phone. Copy stays generic (no shipping or discount promises the
 * store has not configured).
 */
export function AnnouncementBar({ storeName }: { storeName: string }) {
	return (
		<div className="bg-plum text-plum-foreground">
			<div className="container-page flex h-10 items-center justify-center text-[12px] font-medium uppercase tracking-[0.08em] lg:h-12 lg:justify-between lg:text-[13px]">
				<p className="hidden items-center gap-2 lg:flex">
					<Sparkles className="size-4" aria-hidden="true" strokeWidth={1.5} />
					Small-batch bath and body care
				</p>
				<p className="flex items-center gap-2">
					<Leaf className="size-4" aria-hidden="true" strokeWidth={1.5} />
					Plant oils, clays and essential oils
				</p>
				<p className="hidden items-center gap-2 lg:flex">
					<Sun className="size-4" aria-hidden="true" strokeWidth={1.5} />
					{storeName} · New batches ·
					<Link href="/products" className="font-semibold underline-offset-4 hover:underline">
						Shop now
					</Link>
				</p>
			</div>
		</div>
	);
}
