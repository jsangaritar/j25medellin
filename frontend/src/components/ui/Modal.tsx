import { X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	const handleClose = useCallback(() => {
		dialogRef.current?.close();
		onClose();
	}, [onClose]);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (isOpen && !dialog.open) {
			dialog.showModal();
		} else if (!isOpen && dialog.open) {
			dialog.close();
		}
	}, [isOpen]);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		function onCancel(e: Event) {
			e.preventDefault();
			handleClose();
		}

		dialog.addEventListener("cancel", onCancel);
		return () => dialog.removeEventListener("cancel", onCancel);
	}, [handleClose]);

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <dialog> natively handles Escape via cancel event
		<dialog
			ref={dialogRef}
			className="m-auto w-full max-w-md rounded-2xl border border-border bg-bg-card p-6 text-text-primary backdrop:bg-black/60"
			onClick={(e) => {
				if (e.target === dialogRef.current) handleClose();
			}}
		>
			<div className="mb-6 flex items-center justify-between">
				<h2 className="font-display text-xl font-bold text-text-primary">
					{title}
				</h2>
				<button
					type="button"
					onClick={handleClose}
					className="rounded-lg p-1 text-text-muted transition-colors hover:text-text-primary"
				>
					<X size={20} />
				</button>
			</div>
			{children}
		</dialog>
	);
}
