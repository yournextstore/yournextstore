"use client";

import { Dialog, DialogContent } from "@/ui/shadcn/dialog";
import { type PanInfo, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

type ProductGalleryProps = {
	images: string[];
};

const ProductImage = ({
	src,
	onSelect,
	index,
	isSelected,
}: {
	src: string;
	onSelect: (index: number) => void;
	index: number;
	isSelected: boolean;
}) => {
	return (
		<div
			onClick={() => onSelect(index)}
			className={`cursor-pointer rounded-lg overflow-hidden ${isSelected ? "ring-2 ring-black" : ""}`}
		>
			<motion.div layoutId={`thumbnail-${index}`}>
				<Image
					className="w-full bg-neutral-100 object-cover object-center transition-opacity hover:opacity-75"
					src={src}
					width={700 / 3}
					height={700 / 3}
					sizes="(max-width: 1024x) 33vw, (max-width: 1280px) 20vw, 225px"
					alt=""
				/>
			</motion.div>
		</div>
	);
};

const GalleryContent = ({
	images,
	selectedIndex,
	setSelectedIndex,
	isModal = false,
}: {
	images: string[];
	selectedIndex: number;
	setSelectedIndex: (index: number) => void;
	isModal?: boolean;
}) => {
	const handleSwipe = (event: TouchEvent, info: PanInfo) => {
		const swipeThreshold = 50;
		const delta = info.offset.x;

		if (Math.abs(delta) > swipeThreshold) {
			if (delta > 0 && selectedIndex > 0) {
				setSelectedIndex(selectedIndex - 1);
			} else if (delta < 0 && selectedIndex < images.length - 1) {
				setSelectedIndex(selectedIndex + 1);
			}
		}
	};

	return (
		<div className={`grid gap-4 ${isModal ? "h-full" : ""}`}>
			<div className={`relative ${isModal ? "h-[80%]" : "aspect-square"} w-full overflow-hidden rounded-lg`}>
				<motion.div
					style={{ height: "100%", width: "100%" }}
					drag="x"
					dragConstraints={{ left: 0, right: 0 }}
					dragElastic={0.2}
					onDragEnd={handleSwipe}
					initial={false}
				>
					<Image
						className="h-full w-full bg-neutral-100 object-contain object-center"
						src={images[selectedIndex] ?? images[0] ?? ""}
						width={isModal ? 1200 : 700}
						height={isModal ? 1200 : 700}
						priority
						sizes={isModal ? "100vw" : "(max-width: 1024x) 100vw, (max-width: 1280px) 50vw, 700px"}
						alt=""
					/>
				</motion.div>
			</div>

			{images.length > 1 && (
				<div className="grid grid-cols-4 gap-2">
					{images.map((src, index) => (
						<ProductImage
							key={index}
							src={src}
							index={index}
							isSelected={index === selectedIndex}
							onSelect={setSelectedIndex}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export const ProductGallery = ({ images }: ProductGalleryProps) => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [isModalOpen, setIsModalOpen] = useState(false);

	if (images.length === 0) return null;

	return (
		<>
			<div>
				<div onClick={() => setIsModalOpen(true)} className="cursor-zoom-in">
					<div className={`relative aspect-square w-full overflow-hidden rounded-lg`}>
						<motion.div
							style={{ height: "100%", width: "100%" }}
							drag="x"
							dragConstraints={{ left: 0, right: 0 }}
							dragElastic={0.2}
							initial={false}
						>
							<Image
								className="h-full w-full bg-neutral-100 object-contain object-center"
								src={images[selectedIndex] ?? images[0] ?? ""}
								width={700}
								height={700}
								priority
								sizes="(max-width: 1024x) 100vw, (max-width: 1280px) 50vw, 700px"
								alt=""
							/>
						</motion.div>
					</div>
				</div>

				{images.length > 1 && (
					<div className="mt-4 grid grid-cols-4 gap-2">
						{images.map((src, index) => (
							<ProductImage
								key={index}
								src={src}
								index={index}
								isSelected={index === selectedIndex}
								onSelect={setSelectedIndex}
							/>
						))}
					</div>
				)}
			</div>

			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent className="max-w-screen-xl h-[90vh] p-0">
					<div className="h-full p-6">
						<GalleryContent
							images={images}
							selectedIndex={selectedIndex}
							setSelectedIndex={setSelectedIndex}
							isModal={true}
						/>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};
