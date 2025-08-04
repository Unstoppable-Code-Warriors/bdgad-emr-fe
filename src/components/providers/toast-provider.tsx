import { Toaster } from "@/components/ui/sonner"

export function ToastProvider() {
	return (
		<Toaster position="top-right" expand={false} richColors closeButton />
	)
}
