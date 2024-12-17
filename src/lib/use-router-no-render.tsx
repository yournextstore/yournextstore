import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const useRouterNoRender = () => {
	// @todo implement other methods from `AppRouterInstance` if needed
	return {
		replace(href: string, options?: unknown): void {
			window.history.replaceState(null, "", href);
		},
		push(href: string, options?: unknown): void {
			window.history.pushState(null, "", href);
		},
	} satisfies Partial<AppRouterInstance>;
};
