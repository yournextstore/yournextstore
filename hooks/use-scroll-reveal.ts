import { useEffect, useRef } from "react";

export function useScrollReveal<T extends HTMLElement>() {
	const ref = useRef<T>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		if (mq.matches) {
			el.setAttribute("data-visible", "true");
			return;
		}

		el.setAttribute("data-scroll-reveal", "");

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						entry.target.setAttribute("data-visible", "true");
						observer.unobserve(entry.target);
					}
				}
			},
			{ threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return ref;
}
