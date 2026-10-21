import { cn } from "@/lib/utils";

/**
 * The original's spinning roundel ("Love your gut. Love your life."), retold as text on a circle:
 * the store's own line runs round a cream disc and turns slowly.
 */
export function CircleText({ text, className }: { text: string; className?: string }) {
	return (
		<svg viewBox="0 0 123 123" role="img" aria-label={text} className={cn("h-auto", className)}>
			<defs>
				<path id="circle-text-arc" d="M61.5,61.5 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
			</defs>
			<circle cx="61.5" cy="61.5" r="61" fill="#fffcfa" />
			<g className="spin-slow">
				<text fill="#1a6b1d" fontSize="14" fontWeight="800" letterSpacing="0.4">
					<textPath href="#circle-text-arc" textLength="272" lengthAdjust="spacing">
						{text}
					</textPath>
				</text>
			</g>
		</svg>
	);
}
