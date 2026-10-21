// Shared listing-toolbar classes. A plain module: a string exported from a "use client"
// file would reach Server Components as a client reference.
export const TOOLBAR_PILL =
	"inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-4 text-xs font-semibold text-foreground/80 transition-colors hover:border-[#9ca3af]";

export const CHIP =
	"inline-flex h-9 items-center rounded-full px-4 text-xs font-semibold uppercase tracking-widest transition-colors";
export const CHIP_IDLE = `${CHIP} border border-border bg-card text-muted-foreground hover:border-[#9ca3af]`;
export const CHIP_ALL = `${CHIP} bg-primary text-primary-foreground`;
export const CHIP_ACTIVE = `${CHIP} bg-brand text-brand-foreground`;
