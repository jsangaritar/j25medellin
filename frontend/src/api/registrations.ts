import type { Registration, StrapiResponse } from "../types";
import { apiPost } from "./client";

interface CreateRegistrationData {
	fullName: string;
	whatsApp: string;
	email: string;
	event?: number;
	course?: number;
}

export function createRegistration(data: CreateRegistrationData) {
	return apiPost<StrapiResponse<Registration>>("/registrations", data);
}
