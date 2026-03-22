"use client";

import { AlertCircleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
	const t = useTranslations("Error");
	return (
		<div
			className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center"
			style={{ minHeight: "90vh" }}
		>
			<AlertCircleIcon className="size-16 text-muted-foreground/50" strokeWidth={1.5} />
			<h1 className="mt-6 text-7xl font-bold tracking-tight">{t("title")}</h1>
			<h2 className="mt-4 text-xl text-muted-foreground">{t("subtitle")}</h2>
			<p className="mt-2 text-sm text-muted-foreground">{t("description")}</p>
			<div className="mt-8 flex items-center gap-4">
				<button
					type="button"
					onClick={reset}
					className="inline-flex items-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
				>
					{t("tryAgain")}
				</button>
				<Link
					href="/"
					className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
				>
					{t("continueShopping")}
				</Link>
			</div>
		</div>
	);
}
