import type { MediaContent, MediaType, StrapiResponse } from "../types";
import { apiFetch } from "./client";

export function getMediaContents(params?: {
	type?: MediaType;
	featured?: boolean;
	pageSize?: number;
}) {
	const filters: Record<string, unknown> = {};
	if (params?.type) {
		filters.type = { $eq: params.type };
	}
	if (params?.featured !== undefined) {
		filters.featured = { $eq: params.featured };
	}

	return apiFetch<StrapiResponse<MediaContent[]>>("/media-contents", {
		query: {
			filters,
			populate: ["thumbnailImage", "file"],
			sort: ["createdAt:desc"],
			pagination: { pageSize: params?.pageSize ?? 25 },
		},
	});
}

export function getMediaContentBySlug(slug: string) {
	return apiFetch<StrapiResponse<MediaContent[]>>("/media-contents", {
		query: {
			filters: { slug: { $eq: slug } },
			populate: ["thumbnailImage", "file"],
		},
	});
}
