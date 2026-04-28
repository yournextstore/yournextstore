// Dynamic import gated on NEXT_PUBLIC_VERCEL_ENV — Next.js inlines NEXT_PUBLIC_*
// at build time, so the bundler DCEs this branch and never emits the toolbar
// chunk on production builds.
if (process.env.NEXT_PUBLIC_VERCEL_ENV !== "production") {
	void import("commerce-kit/browser");
}
