import type { Config } from "@sveltejs/kit";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import adapter from "svelte-adapter-bun";

const config: Config = {
	preprocess: vitePreprocess(),

	compilerOptions: { runes: true },

	kit: {
		adapter: adapter(),
	},
};

export default config;
