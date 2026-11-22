"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group } from "three";
function Instrument() {
	const group = useRef<Group>(null);
	useFrame((_, delta) => {
		if (group.current) group.current.rotation.y += Math.min(delta, 0.05) * 0.12;
	});
	const stars = useMemo(() => {
		const a = new Float32Array(100 * 3);
		for (let i = 0; i < 100; i++) {
			a[3 * i] = Math.sin(i * 48.2) * 4;
			a[3 * i + 1] = Math.cos(i * 66.3) * 2.8;
			a[3 * i + 2] = -1 - Math.abs(Math.sin(i)) * 3;
		}
		return a;
	}, []);
	return (
		<>
			<ambientLight intensity={1.7} />
			<directionalLight position={[3, 4, 4]} intensity={4} />
			<group ref={group} rotation={[0.28, 0.3, -0.4]}>
				{[0, 1, 2].map((i) => (
					<mesh key={i} rotation={[i * 0.68, i * 0.95, 0]}>
						<torusGeometry args={[1.15 - i * 0.12, 0.018, 8, 80]} />
						<meshStandardMaterial
							color="#c6a66b"
							metalness={0.65}
							roughness={0.3}
						/>
					</mesh>
				))}
				<mesh>
					<icosahedronGeometry args={[0.45, 1]} />
					<meshBasicMaterial color="#75cfc3" wireframe />
				</mesh>
			</group>
			<points>
				<bufferGeometry>
					<bufferAttribute attach="attributes-position" args={[stars, 3]} />
				</bufferGeometry>
				<pointsMaterial size={0.018} color="#d1dfdd" />
			</points>
		</>
	);
}
export default function Stars() {
	return (
		<Canvas
			dpr={[1, 1.5]}
			gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
			camera={{ position: [0, 0, 3.8], fov: 45 }}
		>
			<Instrument />
		</Canvas>
	);
}
