import { cva, type VariantProps } from "class-variance-authority";

// Shared class strings live in a plain module: exported from a "use client" file they would
// reach Server Components as client references, not strings.

/** The original's pill CTA: Instrument Serif in a 999px pill with a 1.5px tomato rule. */
export const pill = cva(
	"relative inline-flex w-fit items-center justify-center whitespace-nowrap rounded-full border-[1.5px] border-brand font-serif leading-[1.5] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
	{
		variants: {
			size: {
				sm: "h-10 px-5 text-b-xl",
				md: "h-[62px] px-7 text-b-4xl tracking-[-0.5px]",
				lg: "h-[72px] px-9 text-b-6xl tracking-[-1px]",
				xl: "h-20 px-11 text-b-8xl tracking-[-1px]",
			},
			variant: {
				// Fill: bright tomato with cream type. Only used at md+ where the serif is large text.
				primary: "bg-brand text-paper hover:bg-background hover:text-brand",
				outline: "bg-transparent text-brand hover:bg-brand hover:text-paper",
				// Small sizes keep the deeper ink so the label clears AA as body text.
				"outline-ink": "bg-transparent text-foreground hover:bg-brand hover:text-paper",
			},
		},
		defaultVariants: { size: "xl", variant: "primary" },
	},
);

export type PillProps = VariantProps<typeof pill>;

/** Serif display heading sizes, mobile then desktop. */
export const headingSizes = {
	section:
		"font-serif text-d-lg leading-[1.2] tracking-[-0.8px] text-brand lg:text-d-3xl lg:tracking-[-1.28px]",
	page: "font-serif text-d-2xl leading-[1.1] tracking-[-1.12px] text-brand lg:text-d-7xl lg:tracking-[-2px]",
	product:
		"font-serif text-d-2xl leading-none tracking-[-1.12px] text-brand lg:text-d-5xl lg:tracking-[-1.6px]",
	hero: "font-serif text-d-3xl leading-none tracking-[-1.28px] lg:text-d-5xl lg:tracking-[-1.6px]",
} as const;
