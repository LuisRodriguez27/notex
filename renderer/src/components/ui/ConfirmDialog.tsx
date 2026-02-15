import { X, AlertCircle } from 'lucide-react';

interface ConfirmDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	isDangerous?: boolean;
}

export const ConfirmDialog = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = "Confirm",
	cancelText = "Cancel",
	isDangerous = false
}: ConfirmDialogProps) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
			<div className="bg-[#1e1e1e] border border-[#3e3e3e] rounded-lg shadow-xl w-100 flex flex-col animate-in fade-in zoom-in duration-200">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b border-[#3e3e3e]">
					<div className="flex items-center gap-2">
						<AlertCircle className={`w-5 h-5 ${isDangerous ? 'text-red-500' : 'text-[#007acc]'}`} />
						<h2 className="text-lg font-semibold text-[#d4d4d4]">{title}</h2>
					</div>
					<button
						onClick={onClose}
						className="p-1 text-[#858585] hover:text-[#d4d4d4] hover:bg-[#3e3e3e] rounded transition-colors"
					>
						<X size={18} />
					</button>
				</div>

				{/* Body */}
				<div className="p-4">
					<p className="text-[#cccccc] text-sm leading-relaxed">
						{message}
					</p>
				</div>

				{/* Footer */}
				<div className="flex justify-end gap-2 p-4 pt-0">
					<button
						onClick={onClose}
						className="px-3 py-1.5 text-sm text-[#cccccc] hover:bg-[#3e3e3e] rounded transition-colors"
					>
						{cancelText}
					</button>
					<button
						onClick={() => {
							onConfirm();
							onClose();
						}}
						className={`px-3 py-1.5 text-sm text-white rounded transition-colors ${
							isDangerous
								? 'bg-red-600 hover:bg-red-700'
								: 'bg-[#007acc] hover:bg-[#0063a5]'
						}`}
					>
						{confirmText}
					</button>
				</div>
			</div>
		</div>
	);
};
