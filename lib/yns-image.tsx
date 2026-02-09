"use client";

import Image, { getImageProps } from "next/image";
import { type ComponentProps, useEffect, useRef, useState } from "react";

type ImageProps = ComponentProps<typeof Image>;

const YNSImageWithPolling = (props: ImageProps) => {
	const { props: resolvedProps } = getImageProps(props as Parameters<typeof getImageProps>[0]);
	const [isReady, setIsReady] = useState(false);
	const abortRef = useRef<AbortController | null>(null);

	const src = resolvedProps.src;

	useEffect(() => {
		setIsReady(false);

		const controller = new AbortController();
		abortRef.current = controller;
		let cancelled = false;

		const poll = async () => {
			while (!cancelled) {
				try {
					const res = await fetch(src, {
						method: "HEAD",
						signal: controller.signal,
					});
					if (res.ok) {
						if (!cancelled) {
							setIsReady(true);
						}
						return;
					}
				} catch {
					if (cancelled) return;
				}
				await new Promise((r) => setTimeout(r, 1000));
			}
		};

		poll();

		return () => {
			cancelled = true;
			controller.abort();
		};
	}, [src]);

	if (!isReady) {
		const style: React.CSSProperties = props.fill
			? { position: "absolute", inset: 0, width: "100%", height: "100%" }
			: { width: resolvedProps.width, height: resolvedProps.height };

		return <div className={`yns-image-shimmer ${props.className ?? ""}`} style={style} />;
	}

	return <Image {...props} />;
};

export const YNSImage = process.env.NODE_ENV === "development" ? YNSImageWithPolling : Image;
