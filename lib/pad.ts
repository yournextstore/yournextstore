/** Two-digit reference number, the way the catalogue numbers its pieces. */
export const pad2 = (value: number) => String(value).padStart(2, "0");
