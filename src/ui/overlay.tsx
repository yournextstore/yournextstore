"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const Overlay = () => {
	const router = useRouter();

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				router.back();
			}
		};
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [router]);

	return <div className="fixed inset-0 bg-black/80" onClick={() => router.back()} />;
};
