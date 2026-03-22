"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

const LOCALE_LABELS: Record<string, string> = {
	"en-US": "EN",
	"de-DE": "DE",
	"es-ES": "ES",
	"pl-PL": "PL",
};

export function LocaleSwitcher({ locales }: { locales: string[] }) {
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newLocale = e.target.value;
		router.replace(pathname, { locale: newLocale });
	};

	return (
		<select
			value={locale}
			onChange={handleChange}
			aria-label="Language"
			className="h-9 rounded-md border border-border bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
		>
			{locales.map((loc) => (
				<option key={loc} value={loc}>
					{LOCALE_LABELS[loc] ?? loc}
				</option>
			))}
		</select>
	);
}
