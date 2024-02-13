import { fontFamily } from "tailwindcss/defaultTheme";
import F from "@tailwindcss/forms"
import P from "./tailwind.plugin"
import T from "@tailwindcss/typography"

/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: ["class"],
	content: ["./src/**/*.{html,js,svelte,ts}"],
	safelist: ["dark"],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px"
			}
		},
		extend: {
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)"
			},
			fontFamily: {
				sans: [...fontFamily.sans]
			}
		}
	},
	plugins: [
		F,
		P,
		T,
		// require("@tailwindcss/forms"),
	]
};

export default config;
