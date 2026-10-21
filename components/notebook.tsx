import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

/**
 * The original's hero notebook: an open spread tilted on the desk, its right fore-edge torn, both
 * pages ruled live by the page-wide paper setting. The left page carries a photograph pasted in;
 * the right page the ink squiggle, two highlighter ticks and a mono note.
 */
export function Notebook({
	image,
	note,
	captionStart,
	captionEnd,
	pages = [14, 15],
	priority = false,
	className,
	tilt = true,
}: {
	image: string | null;
	note: React.ReactNode;
	captionStart: React.ReactNode;
	captionEnd?: React.ReactNode;
	pages?: [number, number];
	priority?: boolean;
	className?: string;
	tilt?: boolean;
}) {
	return (
		<figure className={cn("book", !tilt && "[transform:none]", className)}>
			<div className="book-pages">
				<div className="book-page book-page--left">
					{image ? (
						<div className="pasted mx-auto mt-[4%] w-[88%] -rotate-[2.2deg]">
							<div className="relative aspect-[4/3] overflow-hidden bg-kraft-2">
								<YNSMedia
									src={image}
									alt=""
									fill
									priority={priority}
									fetchPriority={priority ? "high" : undefined}
									sizes="(max-width: 920px) 45vw, 290px"
									className="object-cover"
								/>
							</div>
						</div>
					) : (
						<svg viewBox="0 0 240 150" aria-hidden="true" className="block h-auto w-full">
							<path
								d="M28 38 q40 -8 96 -4 q30 2 52 6 q6 1 4 4 q-40 4 -96 2 q-34 -1 -56 -4 q-3 -2 0 -4 Z"
								fill="var(--blue)"
								opacity=".8"
							/>
							<path
								d="M28 78 q46 -9 104 -4 q26 2 44 6 q7 2 4 5 q-44 5 -100 2 q-30 -2 -52 -5 q-4 -2 0 -4 Z"
								fill="var(--blue)"
								opacity=".62"
							/>
						</svg>
					)}
					<span
						aria-hidden="true"
						className="mono absolute bottom-[0.55rem] left-4 text-[0.62rem] text-faint"
					>
						{pages[0]}
					</span>
				</div>
				<div className="book-page book-page--right">
					<span className="margin-line" aria-hidden="true" />
					<svg viewBox="0 0 240 150" aria-hidden="true" className="block h-auto w-full">
						<path
							d="M30 96 q22 -44 34 -22 q8 16 -8 18 q-14 2 -4 -14 q16 -28 36 -18 q22 11 44 2 q26 -10 48 4 q14 9 30 4"
							fill="none"
							stroke="var(--pen)"
							strokeWidth="2.6"
							strokeLinecap="round"
							opacity=".85"
						/>
						<path
							d="M154 52 l6 -18 M170 54 l10 -16"
							stroke="var(--hl)"
							strokeWidth="7"
							strokeLinecap="round"
							opacity=".8"
						/>
					</svg>
					<div className="mono absolute bottom-[1.6rem] left-[clamp(.9rem,2vw,1.4rem)] right-4 text-[0.66rem] leading-[1.5] tracking-[0.06em] text-faint">
						{note}
					</div>
					<span
						aria-hidden="true"
						className="mono absolute bottom-[0.55rem] right-[1.4rem] text-[0.62rem] text-faint"
					>
						{pages[1]}
					</span>
				</div>
				<span className="stitch" aria-hidden="true" />
			</div>
			<figcaption className="mono mt-[1.1rem] flex flex-wrap justify-between gap-x-4 gap-y-1 text-[0.72rem] text-faint">
				<span className="min-w-0">{captionStart}</span>
				{captionEnd && <span>{captionEnd}</span>}
			</figcaption>
		</figure>
	);
}
