import type { SiteConfig, StrapiResponse } from "../types";
import { apiFetch } from "./client";

export function getSiteConfig() {
	return apiFetch<StrapiResponse<SiteConfig>>("/site-config", {
		query: {
			populate: ["heroImage"],
		},
	});
}
