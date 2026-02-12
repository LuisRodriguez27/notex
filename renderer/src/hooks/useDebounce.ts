import { useEffect, useState } from 'react';

/**
 * Hook to debounce a value.
 * @param value The value to debounce.
 * @param delay The delay in milliseconds.
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(timer);
		};
	}, [value, delay]);

	return debouncedValue;
}

// EJEMPLO DE USO
// const [searchTerm, setSearchTerm] = useState("");
// const debouncedSearch = useDebounce(searchTerm, 500); // Espera 500ms

// useEffect(() => {
//    // Esto solo se ejecuta cuando debouncedSearch cambia (al dejar de escribir)
//    searchNotes(debouncedSearch);
// }, [debouncedSearch]);