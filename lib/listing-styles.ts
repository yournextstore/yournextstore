// Shared by the client toolbar controls and their server-rendered Suspense fallbacks, so it
// lives in a plain module (a constant exported from a "use client" file reaches the server
// as a client reference, not the string).
export const TOOLBAR_CONTROL =
	"inline-flex h-8 items-center gap-1 rounded-md bg-background px-2 shadow-md transition-shadow hover:shadow-lg";

export const FILTERS_BUTTON = `${TOOLBAR_CONTROL} hover:bg-foreground hover:text-white`;
