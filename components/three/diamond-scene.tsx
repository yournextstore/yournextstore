"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial, Sparkles } from "@react-three/drei";
import { Suspense, useRef, useMemo } from "react";
import type { Mesh, Group } from "three";
import * as THREE from "three";

function Diamond({ position = [0, 0, 0] as [number, number, number], scale = 1 }) {
	const meshRef = useRef<Mesh>(null);

	// Create diamond geometry
	const geometry = useMemo(() => {
		const geo = new THREE.OctahedronGeometry(1, 0);
		// Stretch to make it more diamond-like
		geo.scale(1, 1.4, 1);
		return geo;
	}, []);

	useFrame((state) => {
		if (meshRef.current) {
			meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
			meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
		}
	});

	return (
		<Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
			<mesh ref={meshRef} position={position} scale={scale} geometry={geometry}>
				<MeshTransmissionMaterial
					backside
					samples={16}
					thickness={0.5}
					chromaticAberration={0.5}
					anisotropy={0.3}
					distortion={0.2}
					distortionScale={0.5}
					temporalDistortion={0.1}
					iridescence={1}
					iridescenceIOR={1}
					iridescenceThicknessRange={[0, 1400]}
					color="#d4af37"
					attenuationColor="#ffd700"
					attenuationDistance={0.5}
				/>
			</mesh>
		</Float>
	);
}

function FloatingRing({ position = [0, 0, 0] as [number, number, number], scale = 1 }) {
	const meshRef = useRef<Mesh>(null);

	useFrame((state) => {
		if (meshRef.current) {
			meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
			meshRef.current.rotation.z = state.clock.elapsedTime * 0.3;
		}
	});

	return (
		<Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
			<mesh ref={meshRef} position={position} scale={scale}>
				<torusGeometry args={[1, 0.05, 16, 100]} />
				<meshStandardMaterial color="#d4af37" metalness={1} roughness={0.1} />
			</mesh>
		</Float>
	);
}

function ParticleField() {
	const groupRef = useRef<Group>(null);

	useFrame((state) => {
		if (groupRef.current) {
			groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
		}
	});

	return (
		<group ref={groupRef}>
			<Sparkles
				count={100}
				scale={10}
				size={2}
				speed={0.4}
				opacity={0.6}
				color="#d4af37"
			/>
		</group>
	);
}

function Scene() {
	return (
		<>
			{/* Main diamond */}
			<Diamond position={[0, 0, 0]} scale={2} />

			{/* Smaller accent diamonds */}
			<Diamond position={[-3, 1.5, -2]} scale={0.6} />
			<Diamond position={[3.5, -1, -1]} scale={0.4} />
			<Diamond position={[2, 2, -3]} scale={0.3} />

			{/* Floating rings */}
			<FloatingRing position={[0, 0, 0]} scale={2.5} />
			<FloatingRing position={[0, 0, 0]} scale={3.2} />

			{/* Particles */}
			<ParticleField />

			{/* Lighting */}
			<ambientLight intensity={0.5} />
			<spotLight
				position={[10, 10, 10]}
				angle={0.15}
				penumbra={1}
				intensity={1}
				color="#ffffff"
			/>
			<spotLight
				position={[-10, -10, -10]}
				angle={0.15}
				penumbra={1}
				intensity={0.5}
				color="#d4af37"
			/>
			<pointLight position={[0, 5, 0]} intensity={0.5} color="#ffd700" />

			{/* Environment for reflections */}
			<Environment preset="studio" />
		</>
	);
}

export function DiamondScene() {
	return (
		<div className="absolute inset-0 opacity-80">
			<Canvas
				camera={{ position: [0, 0, 8], fov: 45 }}
				gl={{ antialias: true, alpha: true }}
				style={{ background: "transparent" }}
			>
				<Suspense fallback={null}>
					<Scene />
				</Suspense>
			</Canvas>
		</div>
	);
}
