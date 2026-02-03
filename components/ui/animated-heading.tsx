"use client";

import { motion } from "framer-motion";

type AnimatedHeadingProps = {
	text: string;
	className?: string;
};

export function AnimatedHeading({ text, className }: AnimatedHeadingProps) {
	const words = text.split(" ");

	return (
		<h1 className={className}>
			{words.map((word, index) => (
				<motion.span
					key={index}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						duration: 0.5,
						delay: index * 0.1,
						ease: "easeOut",
					}}
					className="inline-block"
				>
					{word}{index < words.length - 1 ? "\u00A0" : ""}
				</motion.span>
			))}
		</h1>
	);
}
