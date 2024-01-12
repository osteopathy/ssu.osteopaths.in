import { fontFamily } from 'tailwindcss/defaultTheme';
import { slateDark as darkShade, slate as lightShade, blue, blueDark, indigo, indigoDark } from '@radix-ui/colors';
import hexRgb from 'hex-rgb';
import { Config } from 'tailwindcss';
import T from "@tailwindcss/typography"
import F from "@tailwindcss/forms"

function getRgbChannels(hex) {
  const { red, green, blue } = hexRgb(hex);
  return `${red} ${green} ${blue}`;
}

function getCssVariableDeclarations(color, name, output = {}) {
  Object.entries(color).forEach(([key, value]) => {
    const o = key.match(/\d+/g)[0];
    if (o) output[`--${name}-${o}`] = getRgbChannels(value);
  });
  return output;
}

const layer = Array.from({ length: 14 }, (_, i) => ({ [i]: `rgb(var(--layer-${i}) / <alpha-value>)` })).reduce(
  (t, v) => ({ ...t, ...v }),
  {},
);

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ['class'],
  content: ['./src/**/*.{html,js,svelte,ts}'],
  safelist: ['dark'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        layer,
      },
      fontFamily: {
        sans: [...fontFamily.sans],
      },
    },
  },
  plugins: [
    T, F,
    function ({ addBase }) {
      addBase({
        ':root': getCssVariableDeclarations(lightShade, 'layer', {
          '--layer-0': getRgbChannels('#ffffff'),
          '--layer-13': getRgbChannels('#000000'),
        }),
        '.theme-indigo': getCssVariableDeclarations(indigo, 'layer', {
          '--layer-0': getRgbChannels('#ffffff'),
          '--layer-13': getRgbChannels('#000000'),
        }),
        '.theme-blue': getCssVariableDeclarations(blue, 'layer', {
          '--layer-0': getRgbChannels('#ffffff'),
          '--layer-13': getRgbChannels('#000000'),
        }),
        '.dark': getCssVariableDeclarations(darkShade, 'layer', {
          '--layer-0': getRgbChannels('#0e0e0e'),
          '--layer-13': getRgbChannels('#ffffff'),
        }),
        '.dark > .theme-blue': getCssVariableDeclarations(blueDark, 'layer', {
          '--layer-0': getRgbChannels('#0e0e0e'),
          '--layer-13': getRgbChannels('#ffffff'),
        }),
        '.dark > .theme-indigo': getCssVariableDeclarations(indigoDark, 'layer', {
          '--layer-0': getRgbChannels('#ffffff'),
          '--layer-13': getRgbChannels('#000000'),
        }),
      });
    },
  ],
} satisfies Config;

export default config;
