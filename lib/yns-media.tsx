"use client";

import Image, { getImageProps } from "next/image";
import { type ComponentProps, useEffect, useState } from "react";
import { isVideoUrl } from "@/lib/utils";

type ImageProps = ComponentProps<typeof Image>;

const YNSImageWithPolling = (props: ImageProps) => {
	const { props: resolvedProps } = getImageProps(props as Parameters<typeof getImageProps>[0]);
	const [isReady, setIsReady] = useState(false);

	const src = resolvedProps.src;

	useEffect(() => {
		setIsReady(false);
		let cancelled = false;

		const probe = () => {
			const img = new window.Image();
			img.onload = () => {
				if (!cancelled) setIsReady(true);
			};
			img.onerror = () => {
				if (cancelled) return;
				setTimeout(probe, 1000);
			};
			img.src = src;
		};

		probe();

		return () => {
			cancelled = true;
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

const YNSImage = process.env.NODE_ENV === "development" ? YNSImageWithPolling : Image;

type YNSMediaProps = ImageProps & {
	autoPlay?: boolean;
	controls?: boolean;
};

/** Renders a <video> for video URLs, otherwise falls back to the Image component. */
export const YNSMedia = ({ autoPlay = true, controls = false, ...props }: YNSMediaProps) => {
	const src = typeof props.src === "string" ? props.src : "";
	if (isVideoUrl(src)) {
		return (
			<video
				className={typeof props.className === "string" ? props.className : undefined}
				style={
					props.fill
						? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }
						: undefined
				}
				src={src}
				muted
				loop
				autoPlay={autoPlay}
				playsInline
				controls={controls}
			/>
		);
	}
	return <YNSImage {...props} />;
};
