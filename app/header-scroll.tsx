"use client";

import { useEffect, useRef } from "react";

/** Marks the sticky header once the page scrolls, for the original's warm shadow. Renders nothing visible. */
export function HeaderScroll() {
	const ref = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		const header = ref.current?.closest("header");
		if (!header) return;
		const update = () => header.setAttribute("data-scrolled", String(window.scrollY > 10));
		update();
		window.addEventListener("scroll", update, { passive: true });
		return () => window.removeEventListener("scroll", update);
	}, []);

	return <span ref={ref} hidden />;
}
