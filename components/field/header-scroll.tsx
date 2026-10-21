"use client";

import { useEffect } from "react";

/** Marks the fixed header as scrolled so it picks up its blurred backdrop (renders nothing). */
export function HeaderScroll() {
	useEffect(() => {
		const header = document.querySelector<HTMLElement>(".site-header");
		if (!header) return;
		const onScroll = () => {
			header.dataset.scrolled = window.scrollY > 24 ? "true" : "false";
		};
		onScroll();
		addEventListener("scroll", onScroll, { passive: true });
		return () => removeEventListener("scroll", onScroll);
	}, []);
	return null;
}
