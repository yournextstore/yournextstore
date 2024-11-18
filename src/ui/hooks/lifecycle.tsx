import { type DependencyList, type EffectCallback, useEffect, useRef } from "react";

export const useDidMount = (cb: EffectCallback) => useEffect(cb, []);

export const useDidUpdate = (cb: EffectCallback, deps?: DependencyList) => {
	const mountRef = useRef(false);

	useEffect(() => {
		if (!mountRef.current) {
			mountRef.current = true;
			return;
		}

		return cb();
	}, deps);
};
