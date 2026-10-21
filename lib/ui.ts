import { cn } from "@/lib/utils";

// The original's button (cva): Merriweather at 20px, 6px radius, burgundy primary or teal secondary,
// a soft tinted glow and an offset ring on hover/focus. Plain module so client and server share it.
const BUTTON_BASE =
	"inline-flex items-center justify-center whitespace-nowrap rounded-md font-serif text-heading-xl ring-offset-2 ring-offset-background transition-[background-color,box-shadow] focus-visible:outline-none focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-60";

const BUTTON_VARIANTS = {
	primary:
		"bg-brand text-on-fill ring-brand-hover hover:bg-brand-hover hover:shadow-brand focus-visible:bg-brand-hover focus-visible:shadow-brand",
	secondary:
		"bg-fill text-on-fill ring-fill-hover hover:bg-fill-hover hover:shadow-fill focus-visible:bg-fill-hover focus-visible:shadow-fill",
} as const;

const BUTTON_SIZES = {
	medium: "h-12 gap-2 px-6 font-normal",
	large: "h-14 gap-3 px-10 font-bold",
	small: "h-10 gap-2 px-4 text-body-md font-normal",
} as const;

export function buttonClass({
	variant = "primary",
	size = "large",
	className,
}: {
	variant?: keyof typeof BUTTON_VARIANTS;
	size?: keyof typeof BUTTON_SIZES;
	className?: string;
} = {}) {
	return cn(BUTTON_BASE, BUTTON_VARIANTS[variant], BUTTON_SIZES[size], className);
}

/** Secondary copy in Roboto, the original's `font-secondary text-secondary`. */
export const BODY_COPY = "font-sans text-body-md text-muted-foreground";

/** Inline text link in the footer/contact style: grey, underline and ink on hover. */
export const QUIET_LINK =
	"font-sans text-body-md text-muted-foreground hover:text-foreground hover:underline focus-visible:text-foreground focus-visible:underline";
