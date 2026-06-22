"use client";

import {
	type MotionValue,
	motion,
	useInView,
	useReducedMotion,
	useScroll,
	useSpring,
	useTransform,
} from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type AnimatedWordProps = {
	children: string;
	delay?: number;
	parallaxIntensity?: number;
	className?: string;
};

function AnimatedWord({ children, delay = 0, parallaxIntensity = 0, className }: AnimatedWordProps) {
	const ref = useRef<HTMLHeadingElement>(null);
	const shouldReduceMotion = useReducedMotion();
	const isInView = useInView(ref, { once: true, margin: "-100px" });

	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start end", "end start"],
	});

	// Enhanced parallax with more dramatic movement
	const y = useTransform(scrollYProgress, [0, 0.5, 1], [parallaxIntensity * 0.5, 0, parallaxIntensity]);
	const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1.05, 1, 1, 0.95]);
	const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.7, 1, 1, 0.5]);
	const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [5, 0, -5]);

	const smoothY = useSpring(y, { stiffness: 80, damping: 20 });
	const smoothScale = useSpring(scale, { stiffness: 80, damping: 20 });
	const smoothOpacity = useSpring(opacity, { stiffness: 80, damping: 20 });
	const smoothRotateX = useSpring(rotateX, { stiffness: 80, damping: 20 });

	const baseClassName =
		"font-display text-[5.5rem] sm:text-[8rem] md:text-[10rem] lg:text-[11rem] leading-[0.85] tracking-tight text-foreground";

	// Reduced motion: show immediately without animation
	if (shouldReduceMotion) {
		return <h1 className={cn(baseClassName, className)}>{children}</h1>;
	}

	const characters = children.split("");

	const containerVariants = {
		hidden: {},
		visible: {
			transition: {
				staggerChildren: 0.03,
				delayChildren: delay,
			},
		},
	};

	const characterVariants = {
		hidden: {
			opacity: 0,
			y: 50,
			rotateX: -90,
		},
		visible: {
			opacity: 1,
			y: 0,
			rotateX: 0,
			transition: {
				type: "spring" as const,
				damping: 12,
				stiffness: 100,
			},
		},
	};

	return (
		<motion.h1
			ref={ref}
			style={{
				y: smoothY as MotionValue<number>,
				scale: smoothScale as MotionValue<number>,
				opacity: smoothOpacity as MotionValue<number>,
				rotateX: smoothRotateX as MotionValue<number>,
				position: "relative",
				transformPerspective: 1000,
			}}
			className={cn(baseClassName, className)}
		>
			<motion.span
				initial="hidden"
				animate={isInView ? "visible" : "hidden"}
				variants={containerVariants}
				aria-label={children}
				className="inline-flex overflow-hidden"
				style={{ perspective: "1000px" }}
			>
				{characters.map((char, index) => (
					<motion.span
						key={`${char}-${index}`}
						variants={characterVariants}
						className="inline-block"
						style={{ transformStyle: "preserve-3d" }}
					>
						{char === " " ? "\u00A0" : char}
					</motion.span>
				))}
			</motion.span>
		</motion.h1>
	);
}

export function HeroTypography() {
	return (
		<div className="relative z-20 mix-blend-normal -mt-20 lg:-mt-32">
			{/* Fallback for no-JS environments */}
			<noscript>
				<h1 className="font-display text-[5.5rem] sm:text-[8rem] md:text-[10rem] lg:text-[11rem] leading-[0.85] tracking-tight text-foreground">
					THE FACE CLEAN
				</h1>
			</noscript>

			<AnimatedWord delay={0} parallaxIntensity={-120}>
				THE
			</AnimatedWord>

			<AnimatedWord delay={0.15} parallaxIntensity={-60}>
				FACE
			</AnimatedWord>

			<AnimatedWord delay={0.3} parallaxIntensity={20} className="relative z-30">
				CLEAN
			</AnimatedWord>
		</div>
	);
}
