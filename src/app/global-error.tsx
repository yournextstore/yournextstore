"use client";

import { useTranslations } from "@/i18n/client";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const t = useTranslations("Global.globalError");

	return (
		<html>
			<body>
				<h2>{t("title")}</h2>
				<p>{error.message}</p>
				{(error.digest || error.stack) && (
					<details>
						<summary>{t("moreDetails")}</summary>
						{error.digest && <p>{error.digest}</p>}
						{error.stack && <pre>{error.stack}</pre>}
					</details>
				)}
				<button onClick={() => reset()}>{t("tryAgainButton")}</button>
			</body>
		</html>
	);
}
