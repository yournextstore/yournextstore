"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import type { Mesh, Group } from "three";
import * as THREE from "three";

function FloatingShape({
	position,
	color,
	scale = 1,
	shape = "sphere",
	speed = 1
}: {
	position: [number, number, number];
	color: string;
	scale?: number;
	shape?: "sphere" | "box" | "cone" | "torus" | "star";
	speed?: number;
}) {
	const meshRef = useRef<Mesh>(null);
	const initialY = position[1];
	const offset = useMemo(() => Math.random() * Math.PI * 2, []);

	useFrame((state) => {
		if (meshRef.current) {
			meshRef.current.position.y = initialY + Math.sin(state.clock.elapsedTime * speed + offset) * 0.5;
			meshRef.current.rotation.x += 0.005 * speed;
			meshRef.current.rotation.y += 0.008 * speed;
		}
	});

	const geometry = useMemo(() => {
		switch (shape) {
			case "box":
				return <boxGeometry args={[1, 1, 1]} />;
			case "cone":
				return <coneGeometry args={[0.5, 1, 8]} />;
			case "torus":
				return <torusGeometry args={[0.4, 0.2, 8, 16]} />;
			case "star":
				return <octahedronGeometry args={[0.6]} />;
			default:
				return <sphereGeometry args={[0.5, 16, 16]} />;
		}
	}, [shape]);

	return (
		<mesh ref={meshRef} position={position} scale={scale}>
			{geometry}
			<meshStandardMaterial
				color={color}
				roughness={0.3}
				metalness={0.2}
				emissive={color}
				emissiveIntensity={0.1}
			/>
		</mesh>
	);
}

function FloatingStars() {
	const groupRef = useRef<Group>(null);

	const stars = useMemo(() => {
		return Array.from({ length: 50 }, (_, i) => ({
			position: [
				(Math.random() - 0.5) * 20,
				(Math.random() - 0.5) * 10,
				(Math.random() - 0.5) * 10 - 5,
			] as [number, number, number],
			scale: Math.random() * 0.1 + 0.05,
		}));
	}, []);

	useFrame((state) => {
		if (groupRef.current) {
			groupRef.current.rotation.y = state.clock.elapsedTime * 0.02;
		}
	});

	return (
		<group ref={groupRef}>
			{stars.map((star, i) => (
				<mesh key={`star-${i}`} position={star.position} scale={star.scale}>
					<octahedronGeometry args={[1]} />
					<meshStandardMaterial
						color="#ffffff"
						emissive="#ffffff"
						emissiveIntensity={0.5}
					/>
				</mesh>
			))}
		</group>
	);
}

function Scene() {
	const shapes = useMemo(() => [
		{ position: [-4, 2, -2] as [number, number, number], color: "#ff69b4", shape: "sphere" as const, scale: 0.8, speed: 0.8 },
		{ position: [4, -1, -3] as [number, number, number], color: "#87ceeb", shape: "box" as const, scale: 0.7, speed: 1.2 },
		{ position: [-3, -2, -1] as [number, number, number], color: "#ffd700", shape: "star" as const, scale: 0.6, speed: 1 },
		{ position: [3, 2, -2] as [number, number, number], color: "#98fb98", shape: "torus" as const, scale: 0.9, speed: 0.9 },
		{ position: [0, 3, -4] as [number, number, number], color: "#dda0dd", shape: "cone" as const, scale: 0.5, speed: 1.1 },
		{ position: [-5, 0, -3] as [number, number, number], color: "#ffb6c1", shape: "sphere" as const, scale: 0.4, speed: 1.3 },
		{ position: [5, 1, -2] as [number, number, number], color: "#add8e6", shape: "box" as const, scale: 0.5, speed: 0.7 },
		{ position: [2, -2, -1] as [number, number, number], color: "#f0e68c", shape: "star" as const, scale: 0.6, speed: 1 },
		{ position: [-2, 1, -3] as [number, number, number], color: "#e6e6fa", shape: "torus" as const, scale: 0.4, speed: 1.2 },
	], []);

	return (
		<>
			<ambientLight intensity={0.6} />
			<pointLight position={[10, 10, 10]} intensity={1} color="#ff69b4" />
			<pointLight position={[-10, -10, 10]} intensity={0.5} color="#87ceeb" />
			<directionalLight position={[0, 5, 5]} intensity={0.8} />

			{shapes.map((shape, i) => (
				<FloatingShape key={`shape-${i}`} {...shape} />
			))}

			<FloatingStars />
		</>
	);
}

export function FloatingShapesBackground() {
	return (
		<div className="absolute inset-0 -z-10 overflow-hidden">
			<Canvas
				camera={{ position: [0, 0, 8], fov: 60 }}
				style={{ background: "transparent" }}
				gl={{ alpha: true, antialias: true }}
			>
				<Scene />
			</Canvas>
		</div>
	);
}
