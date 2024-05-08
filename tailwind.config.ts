import { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

const config: Config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [forms]
};

export default config;
