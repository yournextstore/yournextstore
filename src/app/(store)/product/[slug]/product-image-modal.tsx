"use client";

import { cn } from "@/lib/utils";
import { YnsLink } from "@/ui/yns-link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

type ImageModalProps = {
	images: string[];
};

export default function ProductImageModal({ images }: ImageModalProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const searchParamsImageIndex = Number.parseInt(searchParams.get("image") ?? "", 10);
	const initialImageIndex = Number.isNaN(searchParamsImageIndex) ? null : searchParamsImageIndex;
	const [imageIndex, setImageIndex] = useState<null | number>(initialImageIndex);

	const changeImageIndex = (index: number | null) => {
		setImageIndex(index);
		if (index !== null) {
			router.replace(`?image=${index}`);
		} else {
			router.replace(`?`);
		}
	};

	const src = imageIndex !== null && images[Number(imageIndex)];

	useEffect(() => {
		setImageIndex(initialImageIndex);
	}, [initialImageIndex]);

	const onDismiss = () => {
		changeImageIndex(null);
	};

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onDismiss();
			}
		};
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, []);

	if (!src) {
		return null;
	}

	const handlePrevious = () => {
		const pos = images.indexOf(src);
		if (pos >= 0) {
			const newPos = (images.indexOf(src) - 1 + images.length) % images.length;
			changeImageIndex(newPos);
		}
	};

	const handleNext = () => {
		const pos = images.indexOf(src);
		if (pos <= images.length - 1) {
			const newPos = (images.indexOf(src) + 1) % images.length;
			changeImageIndex(newPos);
		}
	};

	const ImageElement = ({ src, className }: { src: string; className?: string }) => {
		return <Image src={src} alt="" fill className={cn(className, "object-contain")} sizes="100vw" />;
	};

	return (
		<div className="fixed inset-0 bg-neutral-100 z-50 flex flex-col animate-in fade-in">
			<div className="flex justify-between p-4">
				<div />
				<button onClick={() => onDismiss()} className="text-neutral-500 hover:text-neutral-700">
					<X className="w-6 h-6" />
				</button>
			</div>

			<div className="flex-grow flex items-center justify-center overflow-hidden">
				<div key={src} className="relative w-full h-full animate-in fade-in">
					<ImageElement src={src} />
				</div>

				<button
					onClick={() => {
						handlePrevious();
					}}
					className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 hover:bg-gray-100 transition-colors"
				>
					<ChevronLeft className="w-6 h-6" />
				</button>
				<button
					onClick={() => {
						handleNext();
					}}
					className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 hover:bg-gray-100 transition-colors"
				>
					<ChevronRight className="w-6 h-6" />
				</button>
			</div>

			<div className="flex justify-center gap-4 py-2">
				{images.map((image, idx) => (
					<Fragment key={idx}>
						<YnsLink
							className={cn(
								"border-transparent border rounded-lg overflow-hidden",
								src === image && "border-black",
							)}
							onClick={(e) => {
								e.preventDefault();
								changeImageIndex(idx);
							}}
							key={idx}
							prefetch={true}
							href={`?image=${idx}`}
							scroll={false}
						>
							<Image src={image} alt={""} width={80} height={80} className="object-cover" sizes="80px" />
						</YnsLink>
						{/* preload images */}
						<ImageElement src={src} className="sr-only" />
					</Fragment>
				))}
			</div>
		</div>
	);
}
