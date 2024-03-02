import { goldDark as darkShade, gray as lightShade, redDark, red } from '@radix-ui/colors';
import hexRgb from 'hex-rgb';
import plugin from 'tailwindcss/plugin';

function getRgbChannels(hex) {
	const { red, green, blue } = hexRgb(hex);
	return `${red} ${green} ${blue}`;
}

function getCssVariableDeclarations(color, name, output = {}) {
	Object.entries(color).forEach(([key, value]) => {
		output[`--${name}-${key.match(/\d+/g)[0]}`] = getRgbChannels(value);
	});
	return output;
}

const layer = Array.from({ length: 14 }, (_, i) => ({
	[i]: `rgb(var(--layer-${i}) / <alpha-value>)`
})).reduce((t, v) => ({ ...t, ...v }), {});

export default plugin(
	function radixColors({ addBase }) {
		addBase({
			':root': {
				...getCssVariableDeclarations(lightShade, 'layer', {
					'--layer-0': getRgbChannels('#ffffff'),
					'--layer-13': getRgbChannels('#000000'),
					'--destructive': getRgbChannels(red['red10']),
					'--destructive-foreground': getRgbChannels(red['red1'])
				}),
				'--background': 'var(--layer-1)',
				'--background-alt': 'var(--layer-1)',
				'--foreground': 'var(--layer-12)',
				'--foreground-alt': 'var(--layer-13)',
				'--muted': 'var(--layer-5)',
				'--muted-foreground': 'var(--layer-11)',
				'--popover': 'var(--layer-0)',
				'--popover-foreground': 'var(--layer-12)',
				'--card': 'var(--layer-0)',
				'--card-alt': 'var(--layer-1)',
				'--card-foreground': 'var(--layer-12)',
				'--border': 'var(--layer-3)',
				'--input': 'var(--layer-6)',
				'--primary': 'var(--layer-13)',
				'--primary-foreground': 'var(--layer-0)',
				'--secondary': 'var(--layer-3)',
				'--secondary-foreground': 'var(--layer-12)',
				'--accent': 'var(--layer-5)',
				'--accent-foreground': 'var(--layer-12)',
				'--ring': 'var(--layer-8)',
				'--radius': '0.5rem'
			},
			'.dark': {
				...getCssVariableDeclarations(darkShade, 'layer', {
					'--layer-0': getRgbChannels('#0e0e0e'),
					'--layer-13': getRgbChannels('#ffffff'),
					'--destructive': getRgbChannels(redDark['red7']),
					'--destructive-foreground': getRgbChannels(redDark['red12'])
				}),
				'--background': 'var(--layer-1)',
				'--background-alt': 'var(--layer-2)',
				'--foreground': 'var(--layer-12)',
				'--foreground-alt': 'var(--layer-11)',
				'--muted': 'var(--layer-5)',
				'--muted-foreground': 'var(--layer-11)',
				'--popover': 'var(--layer-3)',
				'--popover-foreground': 'var(--layer-12)',
				'--card': 'var(--layer-3)',
				'--card-alt': 'var(--layer-4)',
				'--card-foreground': 'var(--layer-12)',
				'--border': 'var(--layer-4)',
				'--input': 'var(--layer-6)',
				'--primary': 'var(--layer-12)',
				'--primary-foreground': 'var(--layer-0)',
				'--secondary': 'var(--layer-3)',
				'--secondary-foreground': 'var(--layer-12)',
				'--accent': 'var(--layer-5)',
				'--accent-foreground': 'var(--layer-12)',
				'--ring': 'var(--layer-8)'
			}
		});
	},
	{
		theme: {
			extend: {
				colors: {
					layer,
					border: 'rgb(var(--border) / <alpha-value>)',
					input: 'rgb(var(--input) / <alpha-value>)',
					ring: 'rgb(var(--ring) / <alpha-value>)',
					background: {
						DEFAULT: 'rgb(var(--background) / <alpha-value>)',
						alt: 'rgb(var(--background-alt) / <alpha-value>)'
					},
					foreground: {
						DEFAULT: 'rgb(var(--foreground) / <alpha-value>)',
						alt: 'rgb(var(--foreground-alt) / <alpha-value>)'
					},
					primary: {
						DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
						foreground: 'rgb(var(--primary-foreground) / <alpha-value>)'
					},
					secondary: {
						DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
						foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)'
					},
					destructive: {
						DEFAULT: 'rgb(var(--destructive) / <alpha-value>)',
						foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)'
					},
					muted: {
						DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
						foreground: 'rgb(var(--muted-foreground) / <alpha-value>)'
					},
					accent: {
						DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
						foreground: 'rgb(var(--accent-foreground) / <alpha-value>)'
					},
					popover: {
						DEFAULT: 'rgb(var(--popover) / <alpha-value>)',
						foreground: 'rgb(var(--popover-foreground) / <alpha-value>)'
					},
					card: {
						DEFAULT: 'rgb(var(--card) / <alpha-value>)',
						foreground: 'rgb(var(--card-foreground) / <alpha-value>)',
						alt: 'rgb(var(--card-alt) / <alpha-value>)'
					}
				}
			}
		}
	}
);
