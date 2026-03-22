import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	locales: ["en-US", "de-DE", "es-ES", "pl-PL"],
	defaultLocale: "en-US",
	localePrefix: "as-needed",
});
