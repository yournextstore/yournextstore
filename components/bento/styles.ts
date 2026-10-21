// Plain module: class strings shared by client and server components.

/** The reference's 44px hairline square (menu, cart, close). */
export const squareButton =
	"relative flex h-11 w-11 flex-none items-center justify-center rounded-md border border-white/15 text-bone transition-colors hover:border-white/30";

/** Amber pill CTA with the arrow disc. */
export const amberPill =
	"group inline-flex items-center gap-3 rounded-full bg-amber py-2 pr-2 pl-6 text-sm font-semibold text-ink-amber transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:brightness-[1.07] active:scale-[0.98]";

/** Hairline ghost pill next to the amber CTA. */
export const ghostPill =
	"inline-flex items-center rounded-full border border-line px-6 py-3 text-sm font-medium text-bone transition-colors duration-500 hover:border-amber/50 hover:text-amber";

/** Rounded hairline input used by search and newsletter fields. */
export const fieldClass =
	"w-full rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-base text-bone placeholder:text-[#8a9a9c] focus:border-amber/60 md:text-sm";

/** Section shell: the reference's 1400px container with 24/48px gutters. */
export const shell = "mx-auto w-full max-w-[1400px] px-6 md:px-12";
