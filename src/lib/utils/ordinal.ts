const enOrdinalRules = new Intl.PluralRules("en-US", { type: "ordinal" });

const suffixes = new Map([
	["one", "st"],
	["two", "nd"],
	["few", "rd"],
	["other", "th"]
]);

export const ordinal = (n: number) => {
	const rule = enOrdinalRules.select(n);
	const suffix = suffixes.get(rule);
	return `${n}${suffix}`;
};
