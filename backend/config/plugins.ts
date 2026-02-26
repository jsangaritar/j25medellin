import type { Core } from "@strapi/strapi";

const config = ({
	// biome-ignore lint/correctness/noUnusedFunctionParameters: Strapi config signature requires env
	env,
}: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({});

export default config;
