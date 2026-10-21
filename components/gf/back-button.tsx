"use client";

import { useRouter } from "next/navigation";
import { BackIcon } from "@/components/gf/icons";
import { gfIconButton } from "@/lib/gf-styles";

export function BackButton({ fallbackHref = "/" }: { fallbackHref?: string }) {
	const router = useRouter();
	return (
		<button
			type="button"
			aria-label="Go back"
			className={gfIconButton}
			onClick={() => {
				// Same rule as the original: step back when there is history, else go to the fallback.
				if (window.history.length > 1) {
					router.back();
				} else {
					router.push(fallbackHref);
				}
			}}
		>
			<BackIcon />
		</button>
	);
}
