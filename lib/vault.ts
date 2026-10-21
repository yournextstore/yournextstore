"use client";

import { useSyncExternalStore } from "react";

import type { SavedPiece } from "@/lib/saved";

export type { SavedPiece };

const KEY = "maison-vault";
const EMPTY: SavedPiece[] = [];
const listeners = new Set<() => void>();
let snapshot: SavedPiece[] | null = null;

function isSaved(value: unknown): value is SavedPiece {
	return typeof value === "object" && value !== null && "slug" in value && "name" in value;
}

function read(): SavedPiece[] {
	try {
		const parsed: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
		return Array.isArray(parsed) ? parsed.filter(isSaved) : EMPTY;
	} catch {
		return EMPTY;
	}
}

function emit() {
	snapshot = null;
	listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
	listeners.add(listener);
	const onStorage = (event: StorageEvent) => event.key === KEY && emit();
	window.addEventListener("storage", onStorage);
	return () => {
		listeners.delete(listener);
		window.removeEventListener("storage", onStorage);
	};
}

function getSnapshot() {
	snapshot ??= read();
	return snapshot;
}

function write(next: SavedPiece[]) {
	try {
		window.localStorage.setItem(KEY, JSON.stringify(next));
	} catch {
		// Private mode or a full quota: the vault stays in memory for this page.
	}
	snapshot = next;
	listeners.forEach((listener) => listener());
}

/** The private vault: pieces saved in this browser (the original's wishlist, kept locally). */
export function useVault() {
	return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

export function toggleSaved(piece: SavedPiece) {
	const current = getSnapshot();
	const saved = current.some((item) => item.slug === piece.slug);
	write(saved ? current.filter((item) => item.slug !== piece.slug) : [...current, piece]);
	return !saved;
}

export function removeSaved(slug: string) {
	write(getSnapshot().filter((item) => item.slug !== slug));
}
