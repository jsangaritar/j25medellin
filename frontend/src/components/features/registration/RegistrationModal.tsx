import { Mail, MessageCircle, User } from "lucide-react";
import { useState } from "react";
import type { Course, Event } from "../../../types";
import { FormField } from "../../ui/FormField";
import { Modal } from "../../ui/Modal";

interface RegistrationModalProps {
	isOpen: boolean;
	onClose: () => void;
	event?: Event;
	course?: Course;
}

export function RegistrationModal({
	isOpen,
	onClose,
	event,
	course,
}: RegistrationModalProps) {
	const [fullName, setFullName] = useState("");
	const [whatsApp, setWhatsApp] = useState("");
	const [email, setEmail] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [success, setSuccess] = useState(false);

	const title = event?.title ?? course?.title ?? "";
	const modalTitle = `Inscripci\u00f3n: ${title}`;

	function resetForm() {
		setFullName("");
		setWhatsApp("");
		setEmail("");
		setSuccess(false);
	}

	function handleClose() {
		resetForm();
		onClose();
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSubmitting(true);

		try {
			// TODO: POST to /api/registrations
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setSuccess(true);
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<Modal isOpen={isOpen} onClose={handleClose} title={modalTitle}>
			{success ? (
				<div className="flex flex-col items-center gap-4 py-4 text-center">
					<div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-dim">
						<MessageCircle size={24} className="text-accent-bright" />
					</div>
					<h3 className="font-display text-lg font-bold text-text-primary">
						&iexcl;Registro exitoso!
					</h3>
					<p className="text-sm text-text-secondary">
						Te enviamos un correo de confirmaci&oacute;n.
					</p>
					<button
						type="button"
						onClick={handleClose}
						className="mt-2 w-full rounded-[10px] bg-accent-bright py-3 text-sm font-semibold text-bg-primary transition-colors hover:bg-accent-muted"
					>
						Cerrar
					</button>
				</div>
			) : (
				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<FormField
						id="reg-name"
						label="Nombre completo"
						placeholder="Tu nombre"
						icon={User}
						value={fullName}
						onChange={(e) => setFullName(e.target.value)}
						required
					/>
					<FormField
						id="reg-whatsapp"
						label="WhatsApp"
						placeholder="+57 300 123 4567"
						icon={MessageCircle}
						type="tel"
						value={whatsApp}
						onChange={(e) => setWhatsApp(e.target.value)}
						required
					/>
					<FormField
						id="reg-email"
						label="Correo electr\u00f3nico"
						placeholder="tu@email.com"
						icon={Mail}
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<button
						type="submit"
						disabled={submitting}
						className="mt-2 w-full rounded-[10px] bg-accent-bright py-3 text-sm font-semibold text-bg-primary transition-colors hover:bg-accent-muted disabled:opacity-50"
					>
						{submitting ? "Enviando..." : "Inscribirme"}
					</button>
				</form>
			)}
		</Modal>
	);
}
