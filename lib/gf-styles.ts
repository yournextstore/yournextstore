// Shared Grofresh class strings. A plain module on purpose: strings exported from a
// "use client" file reach Server Components as client references, not text.

/** 50px round grey control (back, cart, menu). */
export const gfIconButton =
	"relative inline-flex size-[50px] shrink-0 items-center justify-center rounded-full bg-flash-white text-foreground transition-colors hover:bg-light-silver focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500";

/** Small round counter step (cart lines, product quantity). */
export const gfStepButton =
	"inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-flash-white transition-colors hover:bg-light-silver disabled:opacity-40 disabled:pointer-events-none";

/** Full-width green pill (checkout, buy now). */
export const gfGreenPill =
	"inline-flex w-full items-center justify-center gap-2 rounded-full bg-green-500 px-6 text-gf-h5 font-bold text-white transition-colors hover:bg-green-700 disabled:bg-flash-white disabled:text-[#8a8a8a] disabled:pointer-events-none";

/** Full-width grey pill (add to cart beside "Buy now"). */
export const gfGreyPill =
	"inline-flex w-full items-center justify-center gap-2 rounded-full bg-flash-white px-6 text-gf-h5 font-bold text-foreground transition-colors hover:bg-light-silver disabled:opacity-50 disabled:pointer-events-none";

/** "See all" link beside a section title. */
export const gfMoreLink = "text-gf-sm text-foreground underline underline-offset-2 hover:text-green-500";
