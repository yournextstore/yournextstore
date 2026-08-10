import { LOCALE } from "@/lib/constants";

export function formatDate(value: string, locale: string = LOCALE): string {
	return new Date(value).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
}
