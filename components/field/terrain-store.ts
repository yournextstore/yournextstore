import { useSyncExternalStore } from "react";

export const TERRAINS = ["alpine", "desert", "coastal"] as const;
export type Terrain = (typeof TERRAINS)[number];

// One page-wide terrain value: the switcher writes it, the hero weather reads it.
let current: Terrain = "alpine";
const listeners = new Set<() => void>();

export function setTerrain(next: Terrain) {
	if (next === current) return;
	current = next;
	for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}

export function getTerrain() {
	return current;
}

export function useTerrain() {
	return useSyncExternalStore(subscribe, getTerrain, () => "alpine" as Terrain);
}

export { subscribe as subscribeTerrain };
